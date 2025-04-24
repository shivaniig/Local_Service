const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const asyncHandler = require('../Middleware/Async');
const { protect, authorize } = require('../Middleware/Auth');

// ✅ Register User
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const validRoles = ['admin', 'user'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
}));

// ✅ Login User
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || user.role !== role) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.status(200).json({
    message: 'Login successful',
    token,
    role: user.role,
  });
}));

// ✅ Get User Profile
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = req.user.toObject();
  delete user.password;

  res.status(200).json({
    success: true,
    data: user,
  });
}));

// ✅ Update User Profile
router.put('/update', protect, asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  const validRoles = ['admin', 'user'];

  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role update' });
  }

  const user = req.user;
  user.name = name || user.name;
  user.email = email || user.email;
  if (role) user.role = role;

  await user.save();
  res.status(200).json({ message: 'Profile updated successfully' });
}));

// ✅ Delete User
router.delete('/delete', protect, asyncHandler(async (req, res) => {
  const user = req.user;
  await user.deleteOne(); // more explicit than remove
  res.status(200).json({ message: 'User deleted successfully' });
}));

// ✅ Address Update
router.post('/address', protect, asyncHandler(async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // ✅ Update address
  user.address = address;

  // ✅ Fallback for old users without a role
  if (!user.role) {
    user.role = 'user';
  }

  // ✅ Save updated user
  await user.save();

  res.status(200).json({ message: 'Address updated' });
}));


module.exports = router;
