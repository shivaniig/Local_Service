const User = require("../Models/User");
const asyncHandler = require("../Middleware/Async");
//const ErrorResponse = require("../utils/errorResponse")

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 201, res);
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
      message: "user not found",
    });
  }
  const protect = (req, res, next) => {
    let token;
    
    // Check if token is in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Get the token from header and remove 'Bearer ' part
        token = req.headers.authorization.split(' ')[1];
  
        // Decode the token and get the user info (e.g., user ID)
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is correctly set
        req.user = decoded.user; // Attach user data to the request
        next();
      } catch (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({
          success: false,
          message: 'Not authorized, token failed',
        });
      }
    }
  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }
  };
  
  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "password didn't matched",
    });
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Helper function to get token from model, create cookie and send response
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
