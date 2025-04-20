const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const serviceRoutes = require("./routes/services")
const bookingRoutes = require("./routes/bookings")
const paymentRoutes = require("./routes/payments")

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fixzy", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/payments", paymentRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../frontend/build")))

  // Any route that is not an API route will be redirected to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "production" ? {} : err,
  })
})
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { bookingId } = req.body;
    // Fetch booking details from your database using bookingId
    // Calculate the amount to charge based on the booking

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Booking #' + bookingId,
            },
            unit_amount: amount * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${process.env.FRONTEND_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = app
