// Backend/routes/hrRoutes.js

import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
// Import all necessary models
import User from "../models/User.js"; 
import Attendance from "../models/Attendance.js"; 
import Leave from "../models/Leave.js";         

const router = express.Router();

// Middleware to protect all HR routes and restrict to 'HR' role
const hrMiddleware = [authMiddleware, roleMiddleware("HR")];

// --- Employee Management (Using User model) ---

// GET /employees: View all employees
router.get("/employees", hrMiddleware, async (req, res) => {
  try {
    // Exclude sensitive hash and internal Mongoose version field
    const employees = await User.find().select("-passwordHash -__v");
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employee list:", error.message);
    res.status(500).json({
      message: "Error fetching employee list",
      error: error.message,
    });
  }
});

// GET /employees/:id: Get single employee profile
router.get("/employees/:id", hrMiddleware, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-passwordHash -__v");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee profile:", error.message);
    res.status(500).json({
      message: "Error fetching employee profile",
      error: error.message,
    });
  }
});

// PATCH /employees/:id: Update employee info
router.patch("/employees/:id", hrMiddleware, async (req, res) => {
  const allowedUpdates = {};
  // Updates based on User.js model fields
  if (req.body.firstName) allowedUpdates.firstName = req.body.firstName;
  if (req.body.lastName) allowedUpdates.lastName = req.body.lastName;
  if (req.body.email) allowedUpdates.email = req.body.email;
  if (req.body.role) allowedUpdates.role = req.body.role;

  if (Object.keys(allowedUpdates).length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update." });
  }

  try {
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select("-passwordHash -__v");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res
      .status(200)
      .json({ message: "Employee profile updated successfully", employee });
  } catch (error) {
    console.error("Error updating employee profile:", error.message);
    res
      .status(500)
      .json({ message: "Error updating employee profile", error: error.message });
  }
});

// --- Attendance Management (Using Attendance model) ---

// POST /attendance/mark: Mark attendance
router.post("/attendance/mark", hrMiddleware, async (req, res) => {
  try {
    const newRecord = new Attendance(req.body);
    await newRecord.save();
    res.status(201).json({ message: "Attendance marked successfully", record: newRecord });
  } catch (error) {
    console.error("Error marking attendance:", error.message);
    res.status(500).json({ message: "Error marking attendance", error: error.message });
  }
});

// GET /attendance: Get all attendance records
router.get("/attendance", hrMiddleware, async (req, res) => {
  try {
    // Populate fields from the referenced User model
    const records = await Attendance.find()
      .populate("employeeId", "firstName lastName email") 
      .select("-__v");
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching attendance records:", error.message);
    res.status(500).json({ message: "Error fetching attendance records", error: error.message });
  }
});

// GET /attendance/:employeeId: Get specific employee attendance
router.get("/attendance/:employeeId", hrMiddleware, async (req, res) => {
  try {
    const records = await Attendance.find({ employeeId: req.params.employeeId }).select("-__v");
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching employee attendance:", error.message);
    res.status(500).json({ message: "Error fetching employee attendance", error: error.message });
  }
});

// PATCH /attendance/:id: Update attendance record
router.patch("/attendance/:id", hrMiddleware, async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json({ message: "Attendance record updated successfully", record });
  } catch (error) {
    console.error("Error updating attendance record:", error.message);
    res.status(500).json({ message: "Error updating attendance record", error: error.message });
  }
});

// DELETE /attendance/:id: Delete attendance record
router.delete("/attendance/:id", hrMiddleware, async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    console.error("Error deleting attendance record:", error.message);
    res.status(500).json({ message: "Error deleting attendance record", error: error.message });
  }
});

// --- Leave Management (Using Leave model, which references Employee model) ---

// GET /leaves: View all leave requests
router.get("/leaves", hrMiddleware, async (req, res) => {
  try {
    // Populate employee details from the Employee model
    const leaves = await Leave.find().populate("employeeId", "name email").select("-__v");
    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leave requests:", error.message);
    res.status(500).json({ message: "Error fetching leave requests", error: error.message });
  }
});

// PATCH /leaves/:id/approve: Approve leave
router.patch("/leaves/:id/approve", hrMiddleware, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" }, // Status is "Approved" in Leave model enum
      { new: true }
    );
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    res.status(200).json({ message: "Leave request approved", leave });
  } catch (error) {
    console.error("Error approving leave:", error.message);
    res.status(500).json({ message: "Error approving leave request", error: error.message });
  }
});

// PATCH /leaves/:id/reject: Reject leave
router.patch("/leaves/:id/reject", hrMiddleware, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" }, // Status is "Rejected" in Leave model enum
      { new: true }
    );
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    res.status(200).json({ message: "Leave request rejected", leave });
  } catch (error) {
    console.error("Error rejecting leave:", error.message);
    res.status(500).json({ message: "Error rejecting leave request", error: error.message });
  }
});

// GET /leaves/:employeeId: Get all leaves for specific employee
router.get("/leaves/:employeeId", hrMiddleware, async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.employeeId }).select("-__v");
    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching employee leaves:", error.message);
    res.status(500).json({ message: "Error fetching employee leaves", error: error.message });
  }
});

export default router;