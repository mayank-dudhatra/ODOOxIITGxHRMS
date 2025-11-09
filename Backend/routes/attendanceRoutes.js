import express from "express";
import {
  markAttendance,
  getAttendanceRecords,
  updateAttendanceRecord,
  deleteAttendanceRecord,
} from "../controllers/attendanceController.js"; 
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ==========================================================
   ⏰ ATTENDANCE MODULE ROUTES
   Base URL → /api/attendance
   ========================================================== */

// Middleware for Admin/HR/Payroll access (Adjust roles as needed, assuming Admin/HR/Payroll can manage attendance)
const protectedAttendance = [authMiddleware, roleMiddleware("CompanyAdmin", "HR", "Payroll")];

// 🔹 POST to manually mark attendance (used by HR/Employee)
router.post("/mark", markAttendance); 

// 🔹 GET all records (Admin/HR/Payroll)
router.get("/", protectedAttendance, getAttendanceRecords);

// 🔹 GET records filtered by ID (HR specific, fetching single employee)
router.get("/:id", protectedAttendance, getAttendanceRecords);

// 🔹 PATCH to update a record (used by HR/Admin)
router.patch("/:id", protectedAttendance, updateAttendanceRecord);

// 🔹 DELETE a record (used by HR/Admin)
router.delete("/:id", protectedAttendance, deleteAttendanceRecord);

export default router;