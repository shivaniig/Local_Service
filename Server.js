const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const shortid = require("shortid");

require("dotenv").config();
//const Service = require("./Models/service_Model"); // Importing Service model

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB Connection Failed ❌", err));

// API route to get all services
// app.get("/api/services", async (req, res) => {
//   try {
//     const services = await Service.find();
//     res.json(services);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// });
// app.get("/api/services", async (req, res) => {
//   console.log("Request received at /api/services");
//   try {
//     const services = await Service.find();
//     res.json(services);
//   } catch (error) {
//     console.error("Error fetching services:", error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log(razorpay);

app.post("/verification", (req, res) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  console.log(req.body);

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    res.status(200).json({
      message: "OK",
    });
  } else {
    res.status(403).json({ message: "Invalid" });
  }
});

app.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = 500;
  const currency = "INR";

  const options = {
    amount,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.log(err);
  }
});

//app.get("/", (req, res) => res.send("API Running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
