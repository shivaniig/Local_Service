const express = require('express');
const router = express.Router();
const User = require('../Models/User'); // Adjust path if needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Register User
router.post('/register', async (req, res) => {
  try {
    console.log("➡️ Incoming /register request:", req.body);

    const { name, email, password, role } = req.body; // Include role in the request body
    console.log("🧪 Field check:", { name, email, password, role });

    if (!name || !email || !password || !role) {
      console.log("❌ Validation failed:", { name, email, password, role });
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Ensure the role is either 'admin' or 'user'
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
      role,  // Save the role in the database
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error("❌ Error in /register:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    // Debugging: Check request body
    console.log("📡 Request body:", { email, password, role });
    console.log('User:', user);
    console.log('Password:', user ? user.password : 'No password found');
    
    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    
    // Debugging: Check if user is found and if password is present
    console.log("🧑‍💻 Found user:", user);

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(400).json({ error: 'Password is missing in the database' });
    }

    // Compare passwords
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Sign JWT and send the response
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    console.error("❌ Error in /login:", error);
    console.log("Password from request body:", password);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ Get User Profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authorization token is required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ name: user.name, email: user.email, role: user.role }); // Include role in profile response
  } catch (error) {
    console.error("❌ Error in /profile:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Update User Profile
router.put('/update', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authorization token is required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, email, role } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;

    // Ensure the role is updated correctly if provided
    if (role && ['admin', 'user'].includes(role)) {
      user.role = role;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error("❌ Error in /update:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Delete User
router.delete('/delete', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authorization token is required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.remove();
    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error("❌ Error in /delete:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
