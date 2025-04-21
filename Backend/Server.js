const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

dotenv.config(); // Load env variables first

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Models
const Service = require('./models/Service');
const Booking = require('./models/Booking'); // Added booking model

// Import routes
const authRoutes = require("./Routes/AuthRoutes");
const userRoutes = require("./Routes/UserRoutes");
const bookingRoutes = require("./Routes/BookingRoutes");
const paymentRoutes = require("./Routes/PaymentRoutes");
const serviceRoutes = require('./Routes/ServiceRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "your_backup_mongo_uri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}

// Service fetch route
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Helper function to get booking details
const getBookingDetails = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId).populate("serviceId");
    if (!booking) return null;

    return {
      amount: booking.totalAmount || 5000, // Fallback amount
    };
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return null;
  }
};

// Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { bookingId } = req.body;

    const bookingDetails = await getBookingDetails(bookingId);
    if (!bookingDetails) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const amount = bookingDetails.amount;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Booking #${bookingId}`,
            },
            unit_amount: amount * 100, // cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `http://localhost:8080/lay/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ url: session.url }); // Send checkout URL
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
