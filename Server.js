const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
//const Service = require("./Models/service_Model"); // Importing Service model

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
.then(() => console.log('MongoDB Connected ✅'))
.catch(err => console.error('MongoDB Connection Failed ❌', err));

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


//app.get("/", (req, res) => res.send("API Running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));