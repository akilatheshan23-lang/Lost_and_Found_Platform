import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri || typeof uri !== "string") {
    throw new Error(
      "MONGO_URI is missing. Create server/.env and set MONGO_URI to a valid MongoDB connection string."
    );
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    family: 4,
    // NOTE: If your network can't resolve Atlas shard hostnames (ENOTFOUND),
    // this won't fix it alone—change DNS or use a different network.
  });

  console.log("✅ MongoDB connected");
}
