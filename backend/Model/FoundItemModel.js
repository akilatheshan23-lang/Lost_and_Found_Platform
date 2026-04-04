const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    imageData: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["electronics", "documents", "accessories", "clothing", "keys", "other"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    foundDate: {
      type: Date,
      required: true,
    },

    userType: {
      type: String,
      enum: ["student", "staff"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    hidden: {
      type: Boolean,
      default: false,
    },

    isClaimed: {
      type: Boolean,
      default: false,
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },

    createdByName: {
      type: String,
      required: true,
    },

    qrToken: {
      type: String,
      default: "",
      index: true,
    },

    qrCodeData: {
      type: String,
      default: "",
    },

    qrScanUrl: {
      type: String,
      default: "",
    },

    qrGeneratedAt: {
      type: Date,
      default: null,
    },

    qrEmailSentAt: {
      type: Date,
      default: null,
    },

    qrEmailFallbackPath: {
      type: String,
      default: "",
    },

    adminNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FoundItem", foundItemSchema);