//backend/routes/user.routes.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Register route
router.post("/register", userController.register);

router.get("/profile", authMiddleware.verifyToken, userController.getProfile);

router.put(
  "/profile",
  authMiddleware.verifyToken,
  userController.updateProfile
);

router.put(
  "/update-password",
  authMiddleware.verifyToken,
  userController.updatePassword
);

router.get("/managers", authMiddleware.verifyToken, userController.getAllManagers);

module.exports = router;
