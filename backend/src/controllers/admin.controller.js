import FoundItem from "../models/FoundItem.js";
import SocialPost from "../models/SocialPost.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { rejectNoteSchema } from "../utils/validators.js";

export async function listPending(req, res) {
  const found = await FoundItem.find({ status: "pending" }).sort({ createdAt: -1 });
  const social = await SocialPost.find({ status: "pending" }).sort({ createdAt: -1 });
  res.json({ found, social });
}

export async function approveFound(req, res) {
  const { id } = req.params;
  const item = await FoundItem.findById(id);
  if (!item) return res.status(404).json({ message: "Not found" });

  item.status = "approved";
  item.adminNote = "";
  await item.save();

  await Notification.create({
    user: item.createdBy,
    message: `✅ Your found item "${item.title}" was approved`,
    type: "success",
    link: "/found",
  });

  res.json(item);
}

export async function rejectFound(req, res) {
  const parsed = rejectNoteSchema.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ message: "Invalid note", issues: parsed.error.issues });

  const { note = "" } = parsed.data;
  const { id } = req.params;
  const item = await FoundItem.findById(id);
  if (!item) return res.status(404).json({ message: "Not found" });

  item.status = "rejected";
  item.adminNote = note;
  await item.save();

  await Notification.create({
    user: item.createdBy,
    message: `❌ Your found item "${item.title}" was rejected${note ? `: ${note}` : ""}`,
    type: "error",
    link: "/found",
  });

  res.json(item);
}

export async function approveSocial(req, res) {
  const { id } = req.params;
  const post = await SocialPost.findById(id);
  if (!post) return res.status(404).json({ message: "Not found" });

  post.status = "approved";
  await post.save();

  await Notification.create({
    user: post.createdBy,
    message: `✅ Your post "${post.title}" was approved`,
    type: "success",
    link: "/social",
  });

  res.json(post);
}

export async function rejectSocial(req, res) {
  const parsed = rejectNoteSchema.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ message: "Invalid note", issues: parsed.error.issues });

  const { note = "" } = parsed.data;
  const { id } = req.params;
  const post = await SocialPost.findById(id);
  if (!post) return res.status(404).json({ message: "Not found" });

  post.status = "rejected";
  await post.save();

  await Notification.create({
    user: post.createdBy,
    message: `❌ Your post "${post.title}" was rejected${note ? `: ${note}` : ""}`,
    type: "error",
    link: "/social",
  });

  res.json(post);
}

export async function toggleHideSocial(req, res) {
  const { id } = req.params;
  const post = await SocialPost.findById(id);
  if (!post) return res.status(404).json({ message: "Not found" });

  post.hidden = !post.hidden;
  await post.save();

  res.json(post);
}

export async function toggleHideFound(req, res) {
  const { id } = req.params;
  const item = await FoundItem.findById(id);
  if (!item) return res.status(404).json({ message: "Not found" });

  item.hidden = !item.hidden;
  await item.save();
  res.json(item);
}

export async function updateFoundImage(req, res) {
  const { id } = req.params;
  const item = await FoundItem.findById(id);
  if (!item) return res.status(404).json({ message: "Not found" });

  const { imageUrl = "", imageData = "" } = req.body || {};
  // Allow either URL or base64 data URL (offline upload). If both provided, data takes priority.
  item.imageUrl = typeof imageUrl === "string" ? imageUrl : "";
  item.imageData = typeof imageData === "string" ? imageData : "";
  await item.save();

  res.json(item);
}

export async function deleteFoundAdmin(req, res) {
  const { id } = req.params;
  const item = await FoundItem.findById(id);
  if (!item) return res.status(404).json({ message: "Not found" });

  await item.deleteOne();

  // Optional notification (best-effort)
  try {
    await Notification.create({
      user: item.createdBy,
      message: `🗑️ Your found item "${item.title}" was removed by admin`,
      type: "error",
      link: "/found",
    });
  } catch {
    // ignore
  }

  res.json({ ok: true });
}


export async function getStats(req, res) {
  const [
    users,
    foundTotal,
    foundPending,
    foundApproved,
    foundRejected,
    foundClaimed,
    foundHidden,
    socialTotal,
    socialPending,
    socialApproved,
    socialRejected,
    socialHidden,
  ] = await Promise.all([
    User.countDocuments({}),
    FoundItem.countDocuments({}),
    FoundItem.countDocuments({ status: "pending" }),
    FoundItem.countDocuments({ status: "approved" }),
    FoundItem.countDocuments({ status: "rejected" }),
    FoundItem.countDocuments({ isClaimed: true }),
    FoundItem.countDocuments({ hidden: true }),
    SocialPost.countDocuments({}),
    SocialPost.countDocuments({ status: "pending" }),
    SocialPost.countDocuments({ status: "approved" }),
    SocialPost.countDocuments({ status: "rejected" }),
    SocialPost.countDocuments({ hidden: true }),
  ]);

  const recentFound = await FoundItem.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title status createdAt createdByName imageUrl imageData category userType hidden");
  const recentSocial = await SocialPost.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title status createdAt createdByName postType imageUrl imageData hidden");

  res.json({
    counts: {
      users,
      found: {
        total: foundTotal,
        pending: foundPending,
        approved: foundApproved,
        rejected: foundRejected,
        claimed: foundClaimed,
        hidden: foundHidden,
      },
      social: { total: socialTotal, pending: socialPending, approved: socialApproved, rejected: socialRejected, hidden: socialHidden },
    },
    recent: { found: recentFound, social: recentSocial },
  });
}
