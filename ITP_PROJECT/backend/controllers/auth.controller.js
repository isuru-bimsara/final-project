//backend/controllers/auth.controller.js

const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/EmailServices");
const User = require("../models/user.model"); // Use your user model

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  // Generate OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Save OTP
  await Otp.create({ email, codeHash, expiresAt });

  // Send OTP email
  await sendOtpEmail(email, code);

  res.json({ message: "OTP sent to email" });
};

exports.verifyOtp = async (req, res) => {
  const { email, code } = req.body;
  // Find unused OTP for this email
  const otpDoc = await Otp.findOne({ email, used: false });

  if (!otpDoc)
    return res.status(400).json({ message: "OTP not found or already used" });
  if (otpDoc.expiresAt < new Date())
    return res.status(400).json({ message: "OTP expired" });

  // Compare entered code with hashed code
  const isMatch = await bcrypt.compare(code, otpDoc.codeHash);
  if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

  // Mark OTP as used
  otpDoc.used = true;
  await otpDoc.save();

  // Log the user in (create JWT)
  const user = await User.findOne({ email });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Return token and user info
  const userProfile = {
    email: user.email,
    name: user.name,
  };

  res.json({
    message: "Login successful",
    token,
    user: userProfile,
    role: user.role,
  });
};

exports.signout = (req, res) => {

  try {
    if (typeof res.clearCookie === "function") {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
  } catch (_) {
    // ignore
  }
  return res.json({ message: "Signout successful" });
};