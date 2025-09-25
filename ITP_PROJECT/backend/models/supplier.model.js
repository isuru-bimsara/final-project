//backend/models/supplier.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create supplier Schema
const supplierSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  SupplierID: { type: String, required: true, unique: true },

  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    minlength: [10, "Contact number must be at least 10 characters"],
  },
  companyName: {
    type: String,
    required: [true, "Company name is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
});

module.exports = mongoose.model("Supplier", supplierSchema);
