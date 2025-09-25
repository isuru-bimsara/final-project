// backend/models/user.model.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: [
        "shopowner",
        "admin",
        "HRmanager",
        "ordersupplymanager",
        "supplier",
        "financialmanager",
        "deliverymanager",
        "feedbackservicemanager",
      ],
      default: "shopowner",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
