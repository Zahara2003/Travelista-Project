const express = require('express');
const Place = require('../models/Place');
const Category = require('../models/Category');
const router = express.Router();

// Get all places
router.get('/', async (req, res) => {
  try {
    const places = await Place.find().populate('category');
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single place
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate('category');
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin - Add place (need to add auth middleware later)
router.post('/', async (req, res) => {
  try {
    const place = new Place(req.body);
    await place.save();
    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;