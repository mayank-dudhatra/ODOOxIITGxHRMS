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

// 🔹 Dashboard summary
router.get("/summary", getPayrollSummary);

// 🔹 Payroll table
router.get("/", getPayrollList);

// 🔹 Process payroll for one employee
router.post("/process/:id", processPayroll);

// 🔹 Reports
router.get("/reports", getPayrollReports);

// 🔹 Settings (✅ Required for /api/payroll/settings)
router.get("/settings", getPayrollSettings);
router.put("/settings", updatePayrollSettings);

export default router;
