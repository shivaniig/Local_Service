const express = require("express")
const router = express.Router()
const {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  addReview,
  getUserBookings,
} = require("../Controllers/Bookings")
const { protect, authorize } = require("../Middleware/Auth")

router.route("/").get(protect, authorize("admin"), getBookings).post(protect, createBooking)

router.get("/user", protect, getUserBookings)

router.route("/:id").get(protect, getBooking)

router.put("/:id/status", protect, updateBookingStatus)
router.post("/:id/review", protect, addReview)

module.exports = router
