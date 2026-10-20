const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  places: [{
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    visit_order: { type: Number },
    estimated_time: { type: String }
  }],
  total_distance: { type: Number },
  total_travel_time: { type: Number },
  estimated_budget: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);