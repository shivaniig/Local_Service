const express = require("express")
const router = express.Router()
const { processPayment } = require("../Controllers/Payments")
const { protect } = require("../Middleware/Auth")

router.post("/:bookingId", protect, processPayment)

module.exports = router
