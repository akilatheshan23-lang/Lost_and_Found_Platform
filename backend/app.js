//password = "rWqjNvO9nMZJTExM";

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./Routes/UserRoute');

const app = express();
const cors = require('cors');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use("/Users", routes);

//add a admin
const bcrypt = require("bcrypt");
const User = require("./Model/UserModel");

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin123", 10);

      await User.create({
        name: "System Admin",
        email: "admin@sliit.lk",
        studentID: "ADMIN001",
        faculty: "Management",
        contactNumber: "0770000000",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Default admin created");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

// MongoDB connection
mongoose.connect("mongodb+srv://LFadmin:rWqjNvO9nMZJTExM@cluster0.gow5pwv.mongodb.net/Lost_And_Found")
.then(async () => {
  console.log("✅ Connected to MongoDB");

  await seedAdmin();

  app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
  });
})
.catch((err) => console.log((err)));