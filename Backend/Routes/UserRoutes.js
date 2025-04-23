const express = require('express');
const router = express.Router();
const User = require('../Models/User'); // Adjust path if needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require("../Middleware/Async")
const { protect } = require('../Middleware/Auth');

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

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,  // Ensure the JWT_SECRET is correct in your environment variables
      { expiresIn: '1h' }
    );

    // Send the token back to the client
    res.json({
      message: 'Login successful',
      token,  // The token is being returned here
      role: user.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get User Profile
// router.get("/profile", async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// });
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user;  // The user is already populated by the `protect` middleware
    res.status(200).json({
      success: true,
      data: user,  // Send the user data in the response
    });
  } catch (err) {
    next(err); // Handle any errors
  }
});

// Route to fetch user profile (protected)
router.get("/profile", protect, exports.getUserProfile);  // Use the protect middleware here

router.post("/address", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.address = req.body.address;
    await user.save();
    res.json({ message: "Address updated" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
