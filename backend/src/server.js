import dotenv from "dotenv";
dotenv.config();

// Helps on some networks that prefer IPv6 first and fail to resolve Atlas shard hosts.
// Safe no-op on older Node versions.
import dns from "dns";
try {
  if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch {}

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err?.message || err);
    console.error(
      "👉 Fix: Check server/.env (MONGO_URI) and Atlas Network Access allow-list. If you see ENOTFOUND, try changing your DNS or using a non-SRV mongodb:// connection string."
    );
    process.exit(1);
  }
}

start();