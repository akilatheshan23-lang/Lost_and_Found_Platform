const SocialPost = require("../Model/SocialPostModel");
const User = require("../Model/UserModel");
const { getValidationMessage, socialCreateSchema, socialUpdateSchema } = require("../utils/validators");

const EDIT_LIMIT_MINUTES = 30;

exports.createSocial = async (req, res) => {
  const parsed = socialCreateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: getValidationMessage(parsed.error, "Invalid social post data"),
      issues: parsed.error.issues,
    });
  }

  const { postType, title, content, imageUrl, imageData, tags } = parsed.data;

  try {
    const creator = await User.findById(req.user.id).select("name");

    const post = await SocialPost.create({
      postType,
      title,
      content,
      imageUrl: imageUrl || "",
      imageData: imageData || "",
      tags: Array.isArray(tags) ? tags : [],
      createdBy: req.user.id,
      createdByName: creator?.name || "User",
      status: req.user.role === "admin" ? "approved" : "pending",
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.listSocialApproved = async (req, res) => {
  try {
    const { cursor, limit = 10, type } = req.query;

    const filter = { status: "approved", hidden: false };

    if (type) filter.postType = type;
    if (cursor) filter.createdAt = { $lt: new Date(cursor) };

    const items = await SocialPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select("postType title content imageUrl imageData tags status hidden createdBy createdByName likes comments createdAt updatedAt");

    const nextCursor = items.length ? items[items.length - 1].createdAt.toISOString() : null;

    res.json({ items, nextCursor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateSocial = async (req, res) => {
  const parsed = socialUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: getValidationMessage(parsed.error, "Invalid social post data"),
      issues: parsed.error.issues,
    });
  }

  try {
    const { id } = req.params;
    const post = await SocialPost.findById(id);

    if (!post) return res.status(404).json({ message: "Not found" });

    const isOwner = String(post.createdBy) === String(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (isOwner && !isAdmin) {
      const diffMins = (Date.now() - post.createdAt.getTime()) / 60000;
      if (diffMins > EDIT_LIMIT_MINUTES) {
        return res.status(403).json({
          message: `Edit limit exceeded (${EDIT_LIMIT_MINUTES} mins)`,
        });
      }
    }

    const { title, content, imageUrl, imageData, tags } = parsed.data;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;
    if (imageData !== undefined) post.imageData = imageData;
    if (tags !== undefined) post.tags = Array.isArray(tags) ? tags : [];

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteSocial = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await SocialPost.findById(id);

    if (!post) return res.status(404).json({ message: "Not found" });

    const isOwner = String(post.createdBy) === String(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.likeSocial = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await SocialPost.findById(id);

    if (!post) return res.status(404).json({ message: "Not found" });

    post.likes = (post.likes || 0) + 1;
    await post.save();

    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.commentSocial = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await SocialPost.findById(id);

    if (!post) return res.status(404).json({ message: "Not found" });

    const commenter = await User.findById(req.user.id).select("name");

    const newComment = {
      user: req.user.id,
      userName: commenter?.name || "User",
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    const addedComment = post.comments[post.comments.length - 1];
    res.status(201).json(addedComment);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.editCommentSocial = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await SocialPost.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = String(comment.user) === String(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed to edit this comment" });
    }

    if (isOwner && !isAdmin) {
      const diffMins = (Date.now() - comment.createdAt.getTime()) / 60000;
      if (diffMins > 30) {
        return res.status(403).json({ message: "Edit limit exceeded (30 mins)" });
      }
    }

    comment.text = text;
    await post.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteCommentSocial = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const post = await SocialPost.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = String(comment.user) === String(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed to delete this comment" });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: "Comment deleted successfully", commentId });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};