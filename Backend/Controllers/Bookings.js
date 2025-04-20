const Booking = require("../models/Booking")
const Service = require("../models/Service")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find().populate([
    { path: "user", select: "name email phone" },
    { path: "service", select: "name price" },
  ])

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  })
})

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate([
    { path: "user", select: "name email phone" },
    { path: "service" },
  ])

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is booking owner or admin
  if (booking.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to access this booking`, 401))
  }

  res.status(200).json({
    success: true,
    booking,
  })
})

// @desc    Get bookings for current user
// @route   GET /api/bookings/user
// @access  Private
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate("service")

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  })
})

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id

  // Check if service exists
  const service = await Service.findById(req.body.service)

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.body.service}`, 404))
  }

  const booking = await Booking.create(req.body)

  res.status(201).json({
    success: true,
    booking,
  })
})

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body

  if (!status) {
    return next(new ErrorResponse("Please provide a status", 400))
  }

  let booking = await Booking.findById(req.params.id)

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  // Check if user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update this booking`, 401))
  }

  // Update status
  booking.status = status
  await booking.save()

  booking = await Booking.findById(req.params.id).populate("service")

  res.status(200).json({
    success: true,
    booking,
  })
})

// @desc    Add review to booking
// @route   POST /api/bookings/:id/review
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body

  if (!rating) {
    return next(new ErrorResponse("Please provide a rating", 400))
  }

  let booking = await Booking.findById(req.params.id)

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  // Check if user is booking owner
  if (booking.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to review this booking`, 401))
  }

  // Check if booking is completed
  if (booking.status !== "completed") {
    return next(new ErrorResponse(`Cannot review a booking that is not completed`, 400))
  }

  // Add review
  booking.review = {
    rating,
    comment,
    createdAt: Date.now(),
  }

  await booking.save()

  // Update service rating
  const service = await Service.findById(booking.service)

  if (service) {
    // Calculate new rating
    const totalRatings = service.reviews
    const currentRatingTotal = service.rating * totalRatings
    const newTotalRatings = totalRatings + 1
    const newAverageRating = (currentRatingTotal + rating) / newTotalRatings

    // Update service
    service.rating = Number.parseFloat(newAverageRating.toFixed(1))
    service.reviews = newTotalRatings
    await service.save()
  }

  booking = await Booking.findById(req.params.id).populate("service")

  res.status(200).json({
    success: true,
    review: booking.review,
    booking,
  })
})
