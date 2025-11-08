import express from "express";
import {
  markAttendance,
  getEmployeeAttendance,
  getAttendanceByDate,
} from "../controllers/attendanceController.js";

const router = express.Router();

// POST - mark attendance
router.post("/mark", markAttendance);

// GET - fetch attendance of a specific employee
router.get("/employee/:employeeId", getEmployeeAttendance);

// GET - fetch attendance for a particular date (for HR/admin)
router.get("/date/:date", getAttendanceByDate);

router.put("/update/:id", updateAttendance);

export default router;
