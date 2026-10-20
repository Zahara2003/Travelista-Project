const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

router.post('/places', async (req, res) => {
    try {
        const newPlace = new Place(req.body);
        await newPlace.save();
        res.status(201).json({ message: 'Place added successfully!', newPlace });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/places/:id', async (req, res) => {
    try {
        req.body.lastUpdated = Date.now();
        const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlace) return res.status(404).json({ message: 'Place not found!' });
        res.status(200).json({ message: 'Place updated successfully!', updatedPlace });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/places/:id', async (req, res) => {
    try {
        const deletedPlace = await Place.findByIdAndDelete(req.params.id);
        if (!deletedPlace) return res.status(404).json({ message: 'Place not found!' });
        res.status(200).json({ message: 'Place deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;