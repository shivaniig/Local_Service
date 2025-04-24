const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

dotenv.config(); // Load env variables

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Models
const Service = require("./models/Service");
const Booking = require("./models/Booking");

// Import Routes
const authRoutes = require("./Routes/AuthRoutes");
const userRoutes = require("./Routes/UserRoutes"); // This contains register/login/profile APIs
const bookingRoutes = require("./Routes/BookingRoutes");
const paymentRoutes = require("./Routes/PaymentRoutes");
const serviceRoutes = require("./Routes/ServiceRoutes");

// Initialize Express App
const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Update if frontend is hosted elsewhere
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://shivanigs0210:SHIVANI0210@cluster3.4nh1e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3", {
    useNewUrlParser: true,
  useUnifiedTopology: true 
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes Setup
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // ✅ Changed from /api/users to /api/user
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../build", "index.html"));
  });
}

app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, services });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ success: false, message: "Server error fetching services", error: err.message });
  }
});

// Helper: Get Booking Details
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

// Stripe Checkout Endpoint
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { bookingId } = req.body;
    const bookingDetails = await getBookingDetails(bookingId);

    if (!bookingDetails) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const amount = bookingDetails.amount;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking #${bookingId}`,
            },
            unit_amount: amount * 100, // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `http://localhost:8080/lay/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: err.stack || err.message || err,
  });
  
  
});


// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
