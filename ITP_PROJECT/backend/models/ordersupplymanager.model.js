//backend/models/ordersupplyManager.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create order supply manager Schema
const orderSupplyManagerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  OrderSupManagerID: { type: String, required: true, unique: true },

  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    minlength: [10, "Contact number must be at least 10 characters"],
  },
  department: {
    type: String,
    enum: ["order and supply"],
    required: [true, "Department is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
});

module.exports = mongoose.model("OrderSupplyManager", orderSupplyManagerSchema);
