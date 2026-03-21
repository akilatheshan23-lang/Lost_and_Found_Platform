import mongoose from "mongoose";

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

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdByName: { type: String, required: true },

    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("SocialPost", socialPostSchema);
