const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary');

router.post('/create', async (req, res) => {
    try {
        const newItinerary = new Itinerary(req.body);
        await newItinerary.save();
        res.status(201).json({ message: 'Itinerary saved successfully!', newItinerary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const itineraries = await Itinerary.find({ userId: req.params.userId }).populate('selectedPlaces');
        res.status(200).json(itineraries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;