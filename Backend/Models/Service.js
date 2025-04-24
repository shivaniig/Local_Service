const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: String,
  color: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  price: { type: Number, required: true },
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
