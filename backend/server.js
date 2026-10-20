const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Static folder setup for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Place Schema & Model (travelTips field added here)
const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  distanceFromAkkaraipattu: { type: Number, required: true },
  operatingHours: { type: String, required: true },
  facilities: { type: [String], required: true },
  travelTips: { type: String, default: "" }, // 🧳 Travel Tips Field Added
  images: { type: [String], required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  entryFee: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const Place = mongoose.models.Place || mongoose.model('Place', placeSchema);

// User Schema & Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "tourist" },
  name: { type: String }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ storage: storage });

// Routes
app.get('/api/places', async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/places/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: 'Place not found' });
    res.status(200).json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Add New Place
app.post('/api/places', upload.single('imageFile'), async (req, res) => {
  try {
    const placeData = req.body;

    if (placeData.facilities && typeof placeData.facilities === 'string') {
      placeData.facilities = placeData.facilities.split(',').map(item => item.trim());
    }
    
    if (req.file) {
      placeData.images = [`http://localhost:${PORT}/uploads/${req.file.filename}`];
    } else {
      placeData.images = ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"];
    }

    const newPlace = new Place(placeData);
    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT - Update Place
app.put('/api/places/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const updateData = req.body;

    if (updateData.facilities && typeof updateData.facilities === 'string') {
      updateData.facilities = updateData.facilities.split(',').map(item => item.trim());
    }

    if (req.file) {
      updateData.images = [`http://localhost:${PORT}/uploads/${req.file.filename}`];
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedPlace) return res.status(404).json({ error: 'Place not found' });
    res.status(200).json(updatedPlace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/places/:id', async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!deletedPlace) return res.status(404).json({ error: 'Place not found' });
    res.status(200).json({ message: 'Place deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// AUTH ROUTES (Register & Login)
// ==========================================

// REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "tourist"
    });

    await newUser.save();
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      name: user.name,
      email: user.email,
      role: user.role,
      token: "sample-admin-token-123"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));