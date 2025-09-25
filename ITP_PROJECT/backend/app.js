//backend/app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const rateLimiter = require("./middlewares/rateLimiter.middleware");
const { verifyToken } = require("./middlewares/auth.middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const employeeRoutes = require("./routes/employee.route");
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected successfully"))
  .catch((err) => console.error("MongoDB Error:", err));

// Routes
//app.use("/api/auth", rateLimiter, authRoutes);
app.use("/api/user", rateLimiter, userRoutes);
app.use("/api/auth", rateLimiter, authRoutes);

app.use("/api/employee", employeeRoutes);

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
