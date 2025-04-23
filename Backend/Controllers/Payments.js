const Booking = require("../models/Booking")
const asyncHandler = require("../Middleware/Async")
const ErrorResponse = require("../Utils/ErrorResponse")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_your_key")

// @desc    Process payment for a booking
// @route   POST /api/payments/:bookingId
// @access  Private
exports.processPayment = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params
  const { paymentMethodId } = req.body

  // Find booking
  const booking = await Booking.findById(bookingId).populate("service")

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${bookingId}`, 404))
  }

  // Check if booking belongs to user
  if (booking.user.toString() !== req.user.userId && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to process this payment`, 401))
  }

  // Check if booking is already paid
  if (booking.isPaid) {
    return next(new ErrorResponse(`Booking is already paid`, 400))
  }

  let paymentResult

  // Process payment based on method
  if (paymentMethodId === "cod") {
    // Cash on delivery - just mark as confirmed
    paymentResult = {
      id: "cod_" + Date.now(),
      status: "confirmed",
    }
  } else {
    // Process Stripe payment
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.service.price * 100, // Stripe expects amount in cents
        currency: "inr",
        payment_method: paymentMethodId,
        confirm: true,
        description: `Payment for ${booking.service.name} service`,
      })

      paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
      }
    } catch (err) {
      return next(new ErrorResponse(`Payment failed: ${err.message}`, 400))
    }
  }

  // Update booking with payment info
  booking.isPaid = true
  booking.paymentMethod = paymentMethodId === "cod" ? "cod" : "online"
  booking.paymentDate = Date.now()
  booking.paymentId = paymentResult.id
  booking.status = "confirmed"

  await booking.save()

  res.status(200).json({
    success: true,
    data: {
      booking,
      payment: paymentResult,
    },
  })
})
