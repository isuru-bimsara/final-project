
// backend/middleware/hrOnly.middleware.js
module.exports = (req, res, next) => {
  
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }


  const User = require("../models/user.model");
  User.findById(req.user._id).then(user => {
    if (user && user.role === "HRmanager") {
      req.user = user; 
      return next();
    } else {
      return res.status(403).json({ message: "Access denied: Only HR Managers can add employees." });
    }
  }).catch(err => {
    return res.status(500).json({ message: "Server error", error: err.message });
  });
};