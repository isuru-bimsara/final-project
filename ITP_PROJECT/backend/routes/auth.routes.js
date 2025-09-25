//backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// Register route
//router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post("/signin", authController.signin);
router.post("/signout", authController.signout);

module.exports = router;
