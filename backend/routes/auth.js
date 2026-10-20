const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;
    
    // Check if User model exists
    if (!User) {
      return res.status(500).json({ error: "User model is not imported properly!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      contactNumber 
    });
    
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("❌ Register Error:", error);
    // இது உண்மையான எரரை நேரடியாக ரெஸ்பான்ஸ் விண்டோவில் காட்டும்
    res.status(500).json({ 
      message: "Detailed Server Error", 
      error: error.message, 
      stack: error.stack 
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role || 'user' }, 
      'your_secret_key', 
      { expiresIn: '7d' }
    );
    
    res.status(200).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role || 'user' 
      } 
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ 
      message: "Detailed Server Error", 
      error: error.message, 
      stack: error.stack 
    });
  }
});

module.exports = router;