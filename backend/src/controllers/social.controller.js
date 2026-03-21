import SocialPost from "../models/SocialPost.js";
import { socialCreateSchema, socialUpdateSchema } from "../utils/validators.js";

const EDIT_LIMIT_MINUTES = 30; // optional edit time window for owners

export async function createSocial(req, res) {
  const parsed = socialCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data", issues: parsed.error.issues });

  const { postType, title, content, imageUrl, imageData, tags } = parsed.data;

  const post = await SocialPost.create({
    postType,
    title,
    content,
    imageUrl: imageUrl || "",
    imageData: imageData || "",
    tags: Array.isArray(tags) ? tags : [],
    createdBy: req.user.id,
    createdByName: req.user.name,
    status: "pending",
  });

  res.status(201).json(post);
}

export async function listSocialApproved(req, res) {
  const { cursor, limit = 10, type } = req.query;

  const filter = { status: "approved", hidden: false };
  if (type) filter.postType = type;
  if (cursor) filter.createdAt = { $lt: new Date(cursor) };

  const items = await SocialPost.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
  const nextCursor = items.length ? items[items.length - 1].createdAt.toISOString() : null;

  res.json({ items, nextCursor });
}

export async function updateSocial(req, res) {
  const parsed = socialUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data", issues: parsed.error.issues });

  const { id } = req.params;
  const post = await SocialPost.findById(id);
  if (!post) return res.status(404).json({ message: "Not found" });

  const isOwner = post.createdBy.toString() === req.user.id;
  if (!isOwner && !req.user.isAdmin) return res.status(403).json({ message: "Not allowed" });

  if (isOwner && !req.user.isAdmin) {
    const diffMins = (Date.now() - post.createdAt.getTime()) / 60000;
    if (diffMins > EDIT_LIMIT_MINUTES) {
      return res.status(403).json({ message: `Edit limit exceeded (${EDIT_LIMIT_MINUTES} mins)` });
    }
  }

  const { title, content, imageUrl, imageData, tags } = parsed.data;
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (imageUrl !== undefined) post.imageUrl = imageUrl;
  if (imageData !== undefined) post.imageData = imageData;
  if (tags !== undefined) post.tags = Array.isArray(tags) ? tags : post.tags;

  await post.save();
  res.json(post);
}

export async function deleteSocial(req, res) {
  const { id } = req.params;
  const post = await SocialPost.findById(id);
  if (!post) return res.status(404).json({ message: "Not found" });

  const isOwner = post.createdBy.toString() === req.user.id;
  if (!isOwner && !req.user.isAdmin) return res.status(403).json({ message: "Not allowed" });

  await post.deleteOne();
  res.json({ ok: true });
}

export async function likeSocial(req, res) {
  const { id } = req.params;
  const post = await SocialPost.findById(id);
  if (!post) return res.status(404).json({ message: "Not found" });

  post.likes = (post.likes || 0) + 1;
  await post.save();
  res.json({ likes: post.likes });
}
