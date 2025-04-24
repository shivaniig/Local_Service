const Booking = require("../models/Booking");
const Service = require("../models/Service");
const asyncHandler = require("../Middleware/Async");
const ErrorResponse = require("../Utils/ErrorResponse");

// @desc    Get all bookings (Admin only)
exports.getBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find().populate("user service");

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

// @desc    Get single booking
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate("user service");

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with ID ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, booking });
});

// @desc    Get bookings for current user
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate("service");

  if (!bookings.length) {
    return res.status(404).json({ success: false, message: "No bookings found for the current user." });
  }

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// @desc    Create new booking
exports.createBooking = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const service = await Service.findById(req.body.service);
  if (!service) {
    return next(new ErrorResponse(`Service not found with ID ${req.body.service}`, 404));
  }

  const booking = await Booking.create(req.body);

  res.status(201).json({ success: true, booking });
});

// @desc    Update booking status
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  if (!status || !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    return next(new ErrorResponse("Invalid booking status provided.", 400));
  }

  let booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new ErrorResponse(`Booking not found with ID ${req.params.id}`, 404));
  }

  if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update this booking`, 401));
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({ success: true, booking });
});

// @desc    Add review to a booking
exports.addReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new ErrorResponse("Rating must be between 1 and 5.", 400));
  }

  let booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new ErrorResponse(`Booking not found with ID ${req.params.id}`, 404));
  }

  if (booking.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to review this booking`, 401));
  }

  if (booking.status !== "completed") {
    return next(new ErrorResponse(`Cannot review a booking that is not completed`, 400));
  }

  booking.review = { rating, comment, createdAt: Date.now() };
  await booking.save();

  const service = await Service.findById(booking.service);
  if (service) {
    const totalRatings = service.reviews || 0;
    const currentRatingTotal = (service.rating || 0) * totalRatings;
    const newTotalRatings = totalRatings + 1;
    const newAverageRating = (currentRatingTotal + rating) / newTotalRatings;

    service.rating = Number.parseFloat(newAverageRating.toFixed(1));
    service.reviews = newTotalRatings;
    await service.save();
  }

  res.status(200).json({ success: true, review: booking.review });
});

