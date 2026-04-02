const mongoose = require("mongoose");

const LostItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },

    userType: { type: String, required: true, enum: ["student", "admin", "staff", "Student", "Staff"] },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Documents", "Accessories", "Clothing", "Books", "Other"],
    },

    location: { type: String, required: true },
    venue: { type: String, required: true },

    date: { type: String, required: true }, // yyyy-mm-dd
    time: { type: String, required: true }, // hh:mm

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, default: "" },

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostItem", LostItemSchema);
