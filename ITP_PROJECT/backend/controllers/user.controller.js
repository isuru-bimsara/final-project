//backend/controllers/user.controller.js

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ShopOwner = require("../models/shopOwner.model");
const HRManager = require("../models/hrManager.model");
const FinancialManager = require("../models/financialManger.model");
const OrderSupplyManager = require("../models/ordersupplyManager.model");
const Supplier = require("../models/supplier.model");
const DeliveryManager = require("../models/deliveryManger.model");
const FeedbackServiceManager = require("../models/feedbackServiceManager.model");
const Counter = require("../models/counter.model");
const { sendWelcomeEmail } = require("../utils/EmailServices");

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      address,
      contactNumber,
      shopType,
      departmentName,
      companyName,
    } = req.body;

    // Basic required fields check
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user (let Mongoose pre-save hook hash password)
    const user = new User({ name, email, password, role });
    await user.save();

    // Get year and month for ID generation
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const key = `${year}-${month}`;

    // Find and increment counter
    const counter = await Counter.findOneAndUpdate(
      { key },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const number = String(counter.seq).padStart(4, "0");

    // Create role-specific records
    if (role === "shopowner") {
      const ShopOwnerID = `SHOP-${year}-${month}-${number}`;
      const shopOwner = new ShopOwner({
        userId: user._id,
        ShopOwnerID,
        ShopName: name,
        address,
        contactNumber,
        ShopType: shopType,
      });
      await shopOwner.save();
    } else if (role === "HRmanager") {
      // Validate departmentName
      if (!departmentName) {
        return res
          .status(400)
          .json({ message: "Missing departmentName for HRmanager" });
      }
      const HRID = `HRMID-${year}-${month}-${number}`;
      const hrManager = new HRManager({
        userId: user._id,
        HRID,
        department: departmentName, // Must be "HR"
        address,
        contactNumber,
      });
      await hrManager.save();
    } else if (role === "financialmanager") {
      if (!departmentName) {
        return res
          .status(400)
          .json({ message: "Missing departmentName for FinancialManager" });
      }
      const FinancialManagerID = `FMID-${year}-${month}-${number}`;
      const financialManager = new FinancialManager({
        userId: user._id,
        FinancialManagerID,
        department: departmentName,
        address,
        contactNumber,
      });
      await financialManager.save();
    } else if (role === "ordersupplymanager") {
      if (!departmentName) {
        return res.status(400).json({
          message: "Missing departmentName for OrderandSupplyManager",
        });
      }
      const OrderSupManagerID = `OSM-${year}-${month}-${number}`;
      const orderSupplyManagerInstance = new OrderSupplyManager({
        userId: user._id,
        OrderSupManagerID,
        department: departmentName,
        address,
        contactNumber,
      });
      await orderSupplyManagerInstance.save();
    } else if (role === "supplier") {
      if (!companyName) {
        return res
          .status(400)
          .json({ message: "Missing companyName for Supplier" });
      }
      const SupplierID = `SID-${year}-${month}-${number}`;
      const supplier = new Supplier({
        userId: user._id,
        SupplierID,
        companyName,
        address,
        contactNumber,
      });
      await supplier.save();
    } else if (role === "deliverymanager") {
      if (!departmentName) {
        return res
          .status(400)
          .json({ message: "Missing departmentName for DeliveryManager" });
      }
      const deliveryManagerID = `DID-${year}-${month}-${number}`;
      const deliveryManager = new DeliveryManager({
        userId: user._id,
        deliveryManagerID,
        department: departmentName,
        address,
        contactNumber,
      });
      await deliveryManager.save();
    } else if (role === "feedbackservicemanager") {
      if (!departmentName) {
        return res.status(400).json({
          message: "Missing departmentName for FeedbackServiceManager",
        });
      }
      const feedbackServiceManagerID = `FSMID-${year}-${month}-${number}`;
      const feedbackServiceManager = new FeedbackServiceManager({
        userId: user._id,
        feedbackServiceManagerID,
        department: departmentName,
        address,
        contactNumber,
      });
      await feedbackServiceManager.save();
    }

    // Remove password before response
    const userObj = user.toObject();
    delete userObj.password;

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (err) {
      console.error("Error sending welcome email:", err);
    }

    res
      .status(201)
      .json({ message: "User registered successfully", user: userObj });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ... import other role models

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    let roleData = null;
    if (user.role === "shopowner") {
      roleData = await ShopOwner.findOne({ userId });
    } else if (user.role === "HRmanager") {
      roleData = await HRManager.findOne({ userId });
    } else if (user.role === "financialmanager") {
      roleData = await FinancialManager.findOne({ userId });
    } else if (user.role === "ordersupplymanager") {
      roleData = await OrderSupplyManager.findOne({ userId });
    } else if (user.role === "supplier") {
      roleData = await Supplier.findOne({ userId });
    } else if (user.role === "deliverymanager") {
      roleData = await DeliveryManager.findOne({ userId });
    } else if (user.role === "feedbackservicemanager") {
      roleData = await FeedbackServiceManager.findOne({ userId });
    }
    res.json({ user, roleData });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//edit user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, roleSpecific } = req.body;

    // Update user base fields
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    // Update role-specific fields
    let roleUpdate = null;
    if (user.role === "shopowner" && roleSpecific) {
      roleUpdate = await ShopOwner.findOneAndUpdate(
        { userId },
        {
          ShopName: roleSpecific.ShopName,
          address: roleSpecific.address,
          contactNumber: roleSpecific.contactNumber,
          ShopType: roleSpecific.ShopType,
        },
        { new: true }
      );
    } else if (user.role === "HRmanager" && roleSpecific) {
      roleUpdate = await HRManager.findOneAndUpdate(
        { userId },
        {
          contactNumber: roleSpecific.contactNumber,
          department: roleSpecific.department,
          address: roleSpecific.address,
        },
        { new: true }
      );
    } else if (user.role === "financialmanager" && roleSpecific) {
      roleUpdate = await FinancialManager.findOneAndUpdate(
        { userId },
        {
          contactNumber: roleSpecific.contactNumber,
          department: roleSpecific.department,
          address: roleSpecific.address,
        },
        { new: true }
      );
    } else if (user.role === "ordersupplymanager" && roleSpecific) {
      roleUpdate = await OrderSupplyManager.findOneAndUpdate(
        { userId },
        {
          contactNumber: roleSpecific.contactNumber,
          department: roleSpecific.department,
          address: roleSpecific.address,
        },
        { new: true }
      );
    } else if (user.role === "supplier" && roleSpecific) {
      roleUpdate = await Supplier.findOneAndUpdate(
        { userId },
        {
          contactNumber: roleSpecific.contactNumber,
          address: roleSpecific.address,
        },
        { new: true }
      );
    } else if (user.role === "deliverymanager" && roleSpecific) {
      roleUpdate = await DeliveryManager.findOneAndUpdate(
        { userId },
        {
          contactNumber: roleSpecific.contactNumber,
          department: roleSpecific.department,
          address: roleSpecific.address,
        },
        { new: true }
      );
    } else if (user.role === "feedbackservicemanager" && roleSpecific) {
      roleUpdate = await FeedbackServiceManager.findOneAndUpdate(
        { userId },
        {
          contactNumber: roleSpecific.contactNumber,
          department: roleSpecific.department,
          address: roleSpecific.address,
        },
        { new: true }
      );
    }

    res.json({ message: "Profile updated", user, roleData: roleUpdate });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user._id; // user from auth middleware
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    user.password = newPassword; // let your User model hash it in pre-save
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add this CORRECTED function to your existing user.controller.js

exports.getAllManagers = async (req, res) => {
  try {
    const managers = [];

    // Get all HR Managers with proper error handling
    try {
      const hrManagers = await HRManager.find()
        .populate('userId', 'name email role createdAt')
        .lean();
      
      console.log('HR Managers found:', hrManagers.length); // Debug log
      
      hrManagers.forEach(hr => {
        if (hr.userId && hr.userId.name) {
          managers.push({
            id: hr._id,
            managerId: hr.HRID,
            name: hr.userId.name,
            email: hr.userId.email,
            role: 'HR Manager',
            department: hr.department || 'HR',
            contactNumber: hr.contactNumber || 'N/A',
            address: hr.address || 'N/A',
            joinDate: hr.userId.createdAt
          });
        }
      });
    } catch (hrError) {
      console.error('Error fetching HR managers:', hrError);
    }

    // Get all Financial Managers
    try {
      const financialManagers = await FinancialManager.find()
        .populate('userId', 'name email role createdAt')
        .lean();
      
      console.log('Financial Managers found:', financialManagers.length); // Debug log
      
      financialManagers.forEach(fm => {
        if (fm.userId && fm.userId.name) {
          managers.push({
            id: fm._id,
            managerId: fm.FinancialManagerID,
            name: fm.userId.name,
            email: fm.userId.email,
            role: 'Financial Manager',
            department: fm.department || 'Finance',
            contactNumber: fm.contactNumber || 'N/A',
            address: fm.address || 'N/A',
            joinDate: fm.userId.createdAt
          });
        }
      });
    } catch (fmError) {
      console.error('Error fetching Financial managers:', fmError);
    }

    // Get all Order Supply Managers
    try {
      const orderSupplyManagers = await OrderSupplyManager.find()
        .populate('userId', 'name email role createdAt')
        .lean();
      
      console.log('Order Supply Managers found:', orderSupplyManagers.length); // Debug log
      
      orderSupplyManagers.forEach(osm => {
        if (osm.userId && osm.userId.name) {
          managers.push({
            id: osm._id,
            managerId: osm.OrderSupManagerID,
            name: osm.userId.name,
            email: osm.userId.email,
            role: 'Order Supply Manager',
            department: osm.department || 'Order & Supply',
            contactNumber: osm.contactNumber || 'N/A',
            address: osm.address || 'N/A',
            joinDate: osm.userId.createdAt
          });
        }
      });
    } catch (osmError) {
      console.error('Error fetching Order Supply managers:', osmError);
    }

    // Get all Delivery Managers
    try {
      const deliveryManagers = await DeliveryManager.find()
        .populate('userId', 'name email role createdAt')
        .lean();
      
      console.log('Delivery Managers found:', deliveryManagers.length); // Debug log
      
      deliveryManagers.forEach(dm => {
        if (dm.userId && dm.userId.name) {
          managers.push({
            id: dm._id,
            managerId: dm.deliveryManagerID,
            name: dm.userId.name,
            email: dm.userId.email,
            role: 'Delivery Manager',
            department: dm.department || 'Delivery',
            contactNumber: dm.contactNumber || 'N/A',
            address: dm.address || 'N/A',
            joinDate: dm.userId.createdAt
          });
        }
      });
    } catch (dmError) {
      console.error('Error fetching Delivery managers:', dmError);
    }

    // Get all Feedback Service Managers
    try {
      const feedbackManagers = await FeedbackServiceManager.find()
        .populate('userId', 'name email role createdAt')
        .lean();
      
      console.log('Feedback Service Managers found:', feedbackManagers.length); // Debug log
      
      feedbackManagers.forEach(fsm => {
        if (fsm.userId && fsm.userId.name) {
          managers.push({
            id: fsm._id,
            managerId: fsm.feedbackServiceManagerID,
            name: fsm.userId.name,
            email: fsm.userId.email,
            role: 'Feedback Service Manager',
            department: fsm.department || 'Customer Service',
            contactNumber: fsm.contactNumber || 'N/A',
            address: fsm.address || 'N/A',
            joinDate: fsm.userId.createdAt
          });
        }
      });
    } catch (fsmError) {
      console.error('Error fetching Feedback Service managers:', fsmError);
    }

    // Sort managers by join date (newest first)
    managers.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));

    console.log('Total managers found:', managers.length); // Debug log
    console.log('Managers breakdown:', managers.map(m => ({ name: m.name, role: m.role })));

    res.json({ 
      success: true, 
      managers,
      totalCount: managers.length,
      breakdown: {
        hrManagers: managers.filter(m => m.role === 'HR Manager').length,
        financialManagers: managers.filter(m => m.role === 'Financial Manager').length,
        orderSupplyManagers: managers.filter(m => m.role === 'Order Supply Manager').length,
        deliveryManagers: managers.filter(m => m.role === 'Delivery Manager').length,
        feedbackManagers: managers.filter(m => m.role === 'Feedback Service Manager').length
      }
    });

  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

