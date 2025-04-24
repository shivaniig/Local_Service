const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const asyncHandler = require("./Async");
const ErrorResponse = require("../Utils/ErrorResponse");

exports.authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from header

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided. Authorization denied." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure your JWT_SECRET is correct
    req.user = decoded; // Attach the decoded user data (userId, role, etc.) to the request

    next(); // Call the next middleware/route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ message: "Token is invalid or expired" });
  }
};
// Middleware to protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization header (Bearer <token>)

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  

  // If token is not found
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Make sure userId is part of JWT payload

    // Find the user in the database by userId
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse("User not found", 404)); // User not found
    }

    // Attach user to request object so other middlewares or route handlers can access it
    req.user = user;
    next(); // Continue to the next middleware/handler
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// Middleware to restrict access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    // Check if user's role matches one of the roles passed in
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }

    next(); // Continue to the next middleware/handler if authorized
  };
};
