require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const routes = require('./Routes/UserRoute');
const unifiedRoutes = require('./Routes/UnifiedRoutes');
const User = require('./Model/UserModel');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || '';

app.locals.dbReady = false;
app.locals.dbMessage = 'Database connection has not started yet';

// Increased request size limit for base64 image uploads
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true, limit: '8mb' }));

app.use(cors({
  origin: [CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    server: 'running',
    dbReady: app.locals.dbReady,
    dbState: mongoose.connection.readyState,
    dbMessage: app.locals.dbMessage,
    timestamp: new Date().toISOString(),
  });
});

const requireDb = (req, res, next) => {
  if (app.locals.dbReady) return next();

  return res.status(503).json({
    message: 'Database is not connected yet. Check backend/.env MONGO_URI and your MongoDB Atlas network access.',
  });
};

app.use('/Users', requireDb, routes);
app.use('/api', requireDb, unifiedRoutes);

// Handle large payload errors properly
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.too.large' || err.name === 'PayloadTooLargeError')) {
    return res.status(413).json({
      message: 'Uploaded image is too large for the server request. Please choose a smaller image or use an image URL.',
    });
  }

  if (err) {
    console.error('Unhandled server error:', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }

  return next();
});

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: process.env.ADMIN_NAME || 'System Admin',
      email: process.env.ADMIN_EMAIL || 'admin@sliit.lk',
      studentID: 'ADMIN001',
      faculty: 'Administration',
      contactNumber: '0770000000',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Default admin created');
  } catch (error) {
    console.error('Error seeding admin:', error?.message || error);
  }
};

const connectToDatabase = async () => {
  if (!MONGO_URI) {
    app.locals.dbReady = false;
    app.locals.dbMessage = 'Missing MONGO_URI in backend/.env';
    console.error('Missing MONGO_URI in backend/.env');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    app.locals.dbReady = true;
    app.locals.dbMessage = 'Connected to MongoDB';
    console.log('Connected to MongoDB');

    await seedAdmin();
  } catch (err) {
    app.locals.dbReady = false;
    app.locals.dbMessage = err?.message || 'MongoDB connection failed';

    console.error('Failed to connect to MongoDB:', err?.message || err);
    console.error('The backend server will keep running so you can still open /health.');

    setTimeout(connectToDatabase, 15000);
  }
};

mongoose.connection.on('connected', () => {
  app.locals.dbReady = true;
  app.locals.dbMessage = 'Connected to MongoDB';
});

mongoose.connection.on('disconnected', () => {
  app.locals.dbReady = false;
  app.locals.dbMessage = 'MongoDB disconnected';
});

mongoose.connection.on('error', (err) => {
  app.locals.dbReady = false;
  app.locals.dbMessage = err?.message || 'MongoDB connection error';
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectToDatabase();
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Change PORT in backend/.env or stop the other process.`);
    process.exit(1);
  }

  console.error('Server error:', err);
  process.exit(1);
});