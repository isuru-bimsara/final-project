//backend/routes/employee.route.js
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const authMiddleware = require("../middlewares/auth.middleware"); // JWT auth, must set req.user._id
const hrOnly = require("../middlewares/hrOnly.middleware");

// router.post("/add", authMiddleware, employeeController.addEmployee);
// HR Manager only route
router.post(
  "/add",
  authMiddleware.verifyToken,
  hrOnly,
  employeeController.addEmployee
);

router.get(
  "/list",
  authMiddleware.verifyToken,
  hrOnly,
  employeeController.getEmployees
);

// router.get(
//   "/all",
//   authMiddleware.verifyToken,
//   hrOnly,
//   employeeController.getAllEmployees
// );

router.put(
  "/update/:id",
  authMiddleware.verifyToken,
  hrOnly,
  employeeController.updateEmployee
);

router.get(
  "/all",
  authMiddleware.verifyToken,
  employeeController.getAllEmployees
);

router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  hrOnly,
  employeeController.deleteEmployee
);

router.get(
  "/department-counts",
  authMiddleware.verifyToken,
  employeeController.getEmployeeCountsByDepartment
);

module.exports = router;
