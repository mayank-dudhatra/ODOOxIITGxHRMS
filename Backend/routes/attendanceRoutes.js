// import express from "express";
// import {
//   markAttendance,
//   getEmployeeAttendance,
//   getAttendanceByDate,
// } from "../controllers/attendanceController.js";

// const router = express.Router();

// // POST - mark attendance
// router.post("/mark", markAttendance);

// // GET - fetch attendance of a specific employee
// router.get("/employee/:employeeId", getEmployeeAttendance);

// // GET - fetch attendance for a particular date (for HR/admin)
// router.get("/date/:date", getAttendanceByDate);

// router.put("/update/:id", updateAttendance);

// export default router;


import express from "express";
import {
  markAttendance,
  getAttendanceRecords,
  updateAttendanceRecord,
  deleteAttendanceRecord,
} from "../controllers/attendanceController.js"; // Import new controller functions

const router = express.Router();

/* ==========================================================
   ⏰ ATTENDANCE MODULE ROUTES
   Base URL → /api/attendance
   ========================================================== */

// 🔹 POST to manually mark attendance (used by HR) or employee check-in/out
router.post("/mark", markAttendance); 

// 🔹 GET all records or filter by ID (GET / or GET /:id)
router.get("/:id", getAttendanceRecords);
router.get("/", getAttendanceRecords);

// 🔹 PATCH to update a record (used by HR)
router.patch("/:id", updateAttendanceRecord);

// 🔹 DELETE a record (used by HR)
router.delete("/:id", deleteAttendanceRecord);

export default router;