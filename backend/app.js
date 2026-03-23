//password = "rWqjNvO9nMZJTExM";

require('dotenv').config();

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

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please stop the process using that port or set PORT to a different value.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
})
.catch((err) => console.log((err)));