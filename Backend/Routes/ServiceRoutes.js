const express = require('express');
const router = express.Router();

// Dummy data for services (You can replace this with database logic later)
let services = [
  { id: 1, name: 'House Cleaning', description: 'Complete house cleaning services', price: 100 },
  { id: 2, name: 'Plumbing', description: 'Expert plumbing services', price: 150 },
  { id: 3, name: 'Electrician', description: 'Certified electricians for your needs', price: 120 }
];

// @route   GET /api/services
// @desc    Get all available services
router.get('/services', (req, res) => {
  res.status(200).json(services);
});

// @route   POST /api/services
// @desc    Add a new service
router.post('/services', (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  const newService = {
    id: services.length + 1, // Auto-incrementing ID
    name,
    description,
    price
  };

  services.push(newService);
  res.status(201).json(newService);
});

// @route   PUT /api/services/:id
// @desc    Update an existing service
router.put('/services/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  const service = services.find(s => s.id == id);

  if (!service) {
    return res.status(404).json({ message: 'Service not found.' });
  }

  if (name) service.name = name;
  if (description) service.description = description;
  if (price) service.price = price;

  res.status(200).json(service);
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
router.delete('/services/:id', (req, res) => {
  const { id } = req.params;

  const index = services.findIndex(s => s.id == id);

  if (index === -1) {
    return res.status(404).json({ message: 'Service not found.' });
  }

  services.splice(index, 1); // Remove service by ID
  res.status(200).json({ message: 'Service deleted successfully.' });
});

module.exports = router;
