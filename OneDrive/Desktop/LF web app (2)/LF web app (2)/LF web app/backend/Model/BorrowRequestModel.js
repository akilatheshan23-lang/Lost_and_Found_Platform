const mongoose = require("mongoose");

const BorrowRequestSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "MarketplaceItem", required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminNote: { type: String, default: "" },
    approvedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BorrowRequest", BorrowRequestSchema);