const mongoose = require("mongoose");

const MarketplaceItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: "" },

    category: {
      type: String,
      enum: ["electronics", "textbooks", "furniture", "clothing", "accessories", "other"],
      required: true,
    },

    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair", "poor"],
      default: "good",
    },

    seller: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    sellerName: { type: String, required: true },
    sellerContact: { type: String, default: "" },
    stockCount: { type: Number, required: true, default: 1, min: 0 },

    status: { type: String, enum: ["available", "pending", "borrowed", "sold"], default: "available" },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", default: null },
    borrowedAt: { type: Date, default: null },
    isApproved: { type: Boolean, default: false }, // Moderation flag
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketplaceItem", MarketplaceItemSchema);
