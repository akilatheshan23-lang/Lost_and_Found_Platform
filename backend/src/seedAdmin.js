import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

async function main() {
  await connectDB(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.log("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    process.exit(1);
  }

  let user = await User.findOne({ email });
  if (user) {
    user.isAdmin = true;
    await user.save();
    console.log("✅ Existing user set to admin:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    passwordHash,
    userType: "staff",
    isAdmin: true,
  });

  console.log("✅ Admin created:", user.email);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
