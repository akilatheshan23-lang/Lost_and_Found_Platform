const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["social", "found", "lost", "marketplace", "admin", "claim"], required: true },
    link: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
