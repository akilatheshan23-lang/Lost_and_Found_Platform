import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    imageData: { type: String, default: "" },

    category: {
      type: String,
      enum: ["electronics", "documents", "accessories", "clothing", "keys", "other"],
      required: true,
    },

    location: { type: String, required: true, trim: true },
    foundDate: { type: Date, required: true },
    userType: { type: String, enum: ["student", "staff"], required: true },

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

    // Admin moderation: hidden items should not appear in the public feed
    hidden: { type: Boolean, default: false },

    isClaimed: { type: Boolean, default: false },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdByName: { type: String, required: true },

    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("FoundItem", foundItemSchema);