const express = require('express');
const router = express.Router();

// உங்கள் Place Model இருக்கும் சரியான பாதையை (Path) இங்கே கொடுக்கவும்.
// உதாரணத்திற்கு: '../models/Place' அல்லது உங்களது ஃபைல் ஸ்ட்ரக்சருக்கு ஏற்ப மாற்றவும்.
const Place = require('../models/Place'); 

// 1. எல்லா இடங்களையும் பெற (Get all places)
router.get('/', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. குறிப்பிட்ட ID-ன் மூலம் ஒரு பிளேஸின் முழு விவரத்தைப் பெற (Get single place by ID) - Debugging Logs உடன்
router.get('/:id', async (req, res) => {
  console.log("👉 Frontend is asking for ID:", req.params.id); // பிரவுசரில் இருந்து வரும் ID-ஐக் காட்டும்
  
  try {
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      console.log("❌ ERROR: Place NOT FOUND in MongoDB for ID:", req.params.id);
      return res.status(404).json({ message: 'Place not found' });
    }
    
    console.log("✅ SUCCESS: Place found ->", place.name);
    res.json(place);
    
  } catch (err) {
    console.error("⚠️ Database Error:", err.message);
    res.status(500).json({ message: 'Server Error or Invalid ID format' });
  }
});

// 3. புதிய பிளேஸ் ஒன்றைச் சேர்க்க (Add Place)
router.post('/', async (req, res) => {
  try {
    const newPlace = new Place(req.body);
    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. பிளேஸை நீக்க (Delete Place)
router.delete('/:id', async (req, res) => {
  try {
    const removedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!removedPlace) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json({ message: 'Place deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;