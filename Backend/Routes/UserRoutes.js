const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../Controllers/AuthController');
const { protect, authorize ,authenticateToken } = require('../Middleware/Auth');

// ✅ Register User
router.post('/register', register);

// ✅ Login User
router.post('/login', login);

// ✅ Get User Profile
router.get('/profile', protect, getMe);

// ✅ Update User Profile (admin only)
router.post('/api/user/address', authenticateToken, async (req, res) => {
  try {
    const { address, role } = req.body;

    if (!address || !role) {
      return res.status(400).json({ message: "Address and role are required." });
    }

    // Ensure user exists and is found
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { address, role } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found or update failed." });
    }

    res.status(200).json({ message: "Profile updated successfully", data: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});

// ✅ Delete User (admin only)
// router.delete('/delete', protect, authorize('admin'), asyncHandler(async (req, res) => {
//   const user = req.user;
//   await user.deleteOne(); // more explicit than remove
//   res.status(200).json({ message: 'User deleted successfully' });
// }));

module.exports = router;
