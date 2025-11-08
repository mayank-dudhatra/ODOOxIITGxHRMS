import express from "express";
import {
  getPendingLeaves,
  approveLeave,
  rejectLeave,
  getAllLeaves,
} from "../controllers/leaveController.js";

const router = express.Router();

// 🔹 GET all pending leaves
router.get("/pending", getPendingLeaves);

// 🔹 POST approve a leave
router.post("/approve/:id", approveLeave);

// 🔹 POST reject a leave
router.post("/reject/:id", rejectLeave);

// 🔹 (Optional) GET all leaves
router.get("/all", getAllLeaves);

export default router;
