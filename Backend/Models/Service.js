const mongoose = require("mongoose")

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a service name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  image: {
    type: String,
    default: "/placeholder.svg?height=200&width=300",
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    enum: ["home", "appliance", "electronics", "cleaning", "other"],
  },
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be more than 5"],
    default: 4.5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Service", ServiceSchema)
