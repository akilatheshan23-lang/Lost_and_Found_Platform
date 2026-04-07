const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema(
  {
    claimItem: { type: mongoose.Schema.Types.ObjectId, ref: "FoundItem", required: true },
    claimedByAccount: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },

    claimedBy: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    userPhone: { type: String, required: true, trim: true },

    claimDate: { type: String, required: true },
    claimPlace: { type: String, required: true, trim: true },
    claimTime: { type: String, required: true },

    claimCategory: {
      type: String,
      required: true,
      enum: ["electronic", "document", "book", "bag", "other", "electronics", "documents", "accessories", "clothing", "keys"],
    },
    itemType: {
      type: String,
      required: true,
      enum: ["mobile", "document", "laptop", "book", "bag", "other", "keys", "clothing", "accessories"],
    },

    itemName: { type: String, required: true, trim: true },
    itemColor: { type: String, required: true, trim: true },
    authorizationDetails: { type: String, required: true, trim: true },

    phoneNumber: { type: String, default: "", trim: true },
    imeiNumber: { type: String, default: "", trim: true },
    laptopContactNumber: { type: String, default: "", trim: true },
    bookColor: { type: String, default: "", trim: true },
    bagColor: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "collected"],
      default: "pending",
    },
    adminNote: { type: String, default: "" },

    approvalNotification: { type: String, default: "" },
    approvedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    collectedAt: { type: Date, default: null },
    emailSentAt: { type: Date, default: null },
    emailFallbackPath: { type: String, default: "" },

    feedback: { type: String, default: "" },
    feedbackRating: { type: Number, default: 0, min: 0, max: 5 },
    feedbackSubmittedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Claim", ClaimSchema);
