import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";

import User from "./models/User.js";
import FoundItem from "./models/FoundItem.js";
import SocialPost from "./models/SocialPost.js";
import Notification from "./models/Notification.js";

async function main() {
  await connectDB(process.env.MONGO_URI);

  // Demo user (student)
  const demoEmail = "student@campus.local";
  const demoPassword = "Student123!";

  let user = await User.findOne({ email: demoEmail });
  if (!user) {
    const passwordHash = await bcrypt.hash(demoPassword, 10);
    user = await User.create({
      name: "Student User",
      email: demoEmail,
      passwordHash,
      userType: "student",
      isAdmin: false,
    });
    console.log("✅ Demo user created:", demoEmail, "password:", demoPassword);
  } else {
    console.log("ℹ️ Demo user already exists:", demoEmail);
  }

  // Demo found item (approved)
  const foundExists = await FoundItem.findOne({ title: "Blue Backpack", createdBy: user._id });
  if (!foundExists) {
    await FoundItem.create({
      title: "Blue Backpack",
      description: "Nike bag with keychain",
      imageUrl: "",
      category: "accessories",
      location: "Library 2nd floor",
      foundDate: new Date(),
      userType: "student",
      status: "approved",
      isClaimed: false,
      createdBy: user._id,
      createdByName: user.name,
    });
    console.log("✅ Demo found item inserted");
  }

  // Demo social post (approved)
  const socialExists = await SocialPost.findOne({ title: "Exam Schedule Update", createdBy: user._id });
  let post = socialExists;
  if (!socialExists) {
    post = await SocialPost.create({
      postType: "announcement",
      title: "Exam Schedule Update",
      content: "Mid exam starts Monday. Check LMS for timetable.",
      imageUrl: "",
      tags: ["exam", "important"],
      status: "approved",
      hidden: false,
      createdBy: user._id,
      createdByName: user.name,
      likes: 0,
    });
    console.log("✅ Demo social post inserted");
  }

  // Demo notification
  const noteExists = await Notification.findOne({ user: user._id, message: /approved/i });
  if (!noteExists && post) {
    await Notification.create({
      user: user._id,
      message: `✅ Your post "${post.title}" was approved`,
      type: "success",
      read: false,
      link: "/social",
    });
    console.log("✅ Demo notification inserted");
  }

  console.log("\nAll done ✅\n");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});