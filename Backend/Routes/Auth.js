const express = require("express")
const router = express.Router()
const { register, login, getMe } = require("../Controllers/Auth")
const { protect } = require("../Middleware/Auth")

router.post("/register", register)
router.post("/login", login)
router.get("/me", protect, getMe)

module.exports = router
