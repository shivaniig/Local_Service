const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Service = require('./models/Service');

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

// Load environment variables
require('dotenv').config();

// Import routes
const authRoutes = require("./Routes/AuthRoutes")
const userRoutes = require("./Routes/UserRoutes")
const bookingRoutes = require("./Routes/BookingRoutes")
const paymentRoutes = require("./Routes/PaymentRoutes")

// Initialize express app
const app = express()
app.use(cors());
app.use(cors({
  origin: "http://localhost:5174", // Allow requests from frontend
  credentials: true, // If using cookies
}));
// Middleware
app.use(express.json())
app.use(morgan("dev"))
const serviceRoutes = require('./Routes/ServiceRoutes');
app.use('/api', serviceRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://shivanigs0210:Majorproject@cluster3.4nh1e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3", {
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

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Any route that is not an API route will be redirected to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { bookingId } = req.body;
    const bookingDetails = await getBookingDetails(bookingId); // Assume this function is implemented

    if (!bookingDetails) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const amount = bookingDetails.amount; // In dollars

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Booking #${bookingId}`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: "http://localhost:5173/return?session_id={CHECKOUT_SESSION_ID}",
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
