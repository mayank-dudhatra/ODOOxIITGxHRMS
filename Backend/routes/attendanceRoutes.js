import express from "express";
import {
  markAttendance,
  getEmployeeAttendance,
  getAttendanceByDate,
  updateAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// 🔹 Employee or HR marks attendance
router.post("/mark", markAttendance);

// 🔹 HR gets attendance of a specific employee
router.get("/employee/:employeeId", getEmployeeAttendance);

// 🔹 HR/Admin view all attendance for a specific date
router.get("/date/:date", getAttendanceByDate);

// 🔹 HR/Admin update attendance manually
router.put("/update/:id", updateAttendance);

export default router;
