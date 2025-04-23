const User = require("../Models/User");
const asyncHandler = require("../Middleware/Async");
const ErrorResponse = require("../Utils/ErrorResponse");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization header (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If token is not found
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Validate role
  if (!role || !["user", "admin", "moderator"].includes(role)) {
    return next(new ErrorResponse('Please specify a valid role', 400));
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('User already exists', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role, // Include role here
  });

  sendTokenResponse(user, 201, res); // You need to define the sendTokenResponse function
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Validate email & password
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Email, password, and role are required",
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Password didn't match",
    });
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id); // Access user ID from request (populated by `protect` middleware)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Helper function to get token from model, create cookie, and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};
