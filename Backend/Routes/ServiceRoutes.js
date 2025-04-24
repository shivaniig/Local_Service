const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// @route   GET /api/services
// @desc    Get all available services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    console.error('Error fetching services:', err.message);
    res.status(500).json({ message: 'Server error while fetching services.' });
  }
});

// @route   POST /api/services
// @desc    Add a new service
router.post('/', async (req, res) => {
  const { name, description, icon, color, rating, reviews, price, image } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: 'Please provide name, description, and price.' });
  }

  try {
    const newService = new Service({
      name,
      description,
      icon,
      color,
      rating,
      reviews,
      price,
      image
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    console.error('Error adding service:', err.message);
    res.status(500).json({ message: 'Server error while adding service.' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update an existing service
router.put('/:id', async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json(updatedService);
  } catch (err) {
    console.error('Error updating service:', err.message);
    res.status(500).json({ message: 'Server error while updating service.' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({ message: 'Service deleted successfully.' });
  } catch (err) {
    console.error('Error deleting service:', err.message);
    res.status(500).json({ message: 'Server error while deleting service.' });
  }
});

module.exports = router;
