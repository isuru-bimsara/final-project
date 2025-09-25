//backend/models/deliveryManager.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create delivery manager Schema
const deliveryManagerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  deliveryManagerID : { type: String, required: true, unique: true },

  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    minlength: [10, "Contact number must be at least 10 characters"],
  },
  department: {
    type: String,
    enum: ["delivery"],
    required: [true, "Department name is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
});

module.exports = mongoose.model("DeliveryManager", deliveryManagerSchema);
