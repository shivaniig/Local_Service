const jwt = require("jsonwebtoken");
const asyncHandler = require("./Async");
const ErrorResponse = require("../Utils/ErrorResponse");
const User = require("../Models/User");

// Protect routes - Middleware for checking if the user is authenticated
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the request has the authorization header and it contains 'Bearer' token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Extract token from 'Bearer <token>'
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Ensure JWT_SECRET is set properly in .env

    // Get the user based on the decoded token (assuming the token contains userId)
    req.user = await User.findById(decoded.userId); // Find user from the database based on userId

    // If user is not found in DB
    if (!req.user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.log('Token verification failed:', err);
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure the user object exists (populated by protect middleware)
    if (!req.user) {
      return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    // Check if the user's role is included in the allowed roles array
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};
