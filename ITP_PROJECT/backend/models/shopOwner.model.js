//backend/models/shopOwner.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create Shop Owner Schema
const shopOwnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ShopName: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  ShopOwnerID: { type: String, required: true, unique: true },
  address: {
    type: String,
    required: [true, "Id is required"],
    trim: true,
  },
  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    minlength: [10, "Contact number must be at least 10 characters"],
  },
  ShopType: {
    type: String,
    enum: ["small", "medium", "large"],
    required: [true, "Shop type is required"],
  },
});

module.exports = mongoose.model("ShopOwner", shopOwnerSchema);
