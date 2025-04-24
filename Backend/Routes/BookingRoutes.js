const express = require("express");
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  getAdminServices,
  updateBookingStatus,
  addReview,
  getUserBookings,
} = require("../Controllers/BookingController");
const { protect, authorize } = require("../Middleware/Auth");

// @desc    Get all bookings (Admin only)
router.route("/").get(protect, authorize("admin"), getBookings).post(protect, createBooking);

// @desc    Get bookings for current user
router.get("/user", protect, getUserBookings);
router.get("/services", protect, authorize("admin"), getAdminServices);

// @desc    Get single booking
router.get("/:id", protect, getBooking);

// @desc    Update booking status
router.put("/:id/status", protect, authorize("admin"), updateBookingStatus);

// @desc    Add review to a booking
router.post("/:id/review", protect, addReview);

module.exports = router;
