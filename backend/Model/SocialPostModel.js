const mongoose = require("mongoose");

const socialPostSchema = new mongoose.Schema(
  {
    postType: { type: String, enum: ["announcement", "event", "update", "general"], required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    imageData: { type: String, default: "" },
    tags: { type: [String], default: [] },

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    hidden: { type: Boolean, default: false },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    createdByName: { type: String, required: true },

    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SocialPost", socialPostSchema);
