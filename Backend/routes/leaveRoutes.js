import express from "express";
import {
  getPendingLeaves,
  approveLeave,
  rejectLeave,
  getAllLeaves,
  requestLeave, // ✅ Add for employee leave submission
} from "../controllers/leaveController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // optional if using auth

const router = express.Router();

/**
 * 🧾 Leave Routes — Used by Employees, HR, and Payroll Officers
 */

// 🟢 Employee — Request new leave
router.post("/request", /* authMiddleware, */ requestLeave);

// 🟡 HR / Payroll — Get all pending leave requests
router.get("/pending", /* authMiddleware, */ getPendingLeaves);

// 🟠 HR / Admin — Get all leaves (approved/rejected too)
router.get("/all", /* authMiddleware, */ getAllLeaves);

// ✅ Approve a leave request
router.put("/approve/:id", /* authMiddleware, */ approveLeave);

// ❌ Reject a leave request
router.put("/reject/:id", /* authMiddleware, */ rejectLeave);

export default router;
