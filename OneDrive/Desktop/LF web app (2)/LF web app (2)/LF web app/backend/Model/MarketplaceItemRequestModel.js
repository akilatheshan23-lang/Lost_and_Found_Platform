const mongoose = require("mongoose");

const MarketplaceItemRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    itemName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["electronics", "textbooks", "furniture", "clothing", "accessories", "other"],
      required: true,
    },
    quantity: { type: Number, required: true, min: 1, max: 100 },
    maxBudget: { type: Number, required: true, min: 1 },
    contactNumber: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketplaceItemRequest", MarketplaceItemRequestSchema);