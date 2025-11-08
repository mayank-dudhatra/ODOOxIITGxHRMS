import express from "express";
import {
  getPayrollSummary,
  getPayrollList,
  processPayroll,
  getPayrollReports,
  getPayrollSettings,
  updatePayrollSettings,
} from "../controllers/payrollController.js";

const router = express.Router();

/* ==========================================================
   💼 PAYROLL MODULE ROUTES
   Base URL → /api/payroll
   ========================================================== */

// 🔹 Dashboard Summary (cards data)
router.get("/summary", getPayrollSummary);

// 🔹 Payroll Table Data
router.get("/", getPayrollList);

// 🔹 Process Payroll for One Employee
router.post("/process/:id", processPayroll); // ✅ use ":id" (matches controller)

// 🔹 Payroll Reports
router.get("/reports", getPayrollReports);

// 🔹 Payroll Settings (PF %, Tax %, etc.)
router.get("/settings", getPayrollSettings);
router.put("/settings", updatePayrollSettings);

export default router;
