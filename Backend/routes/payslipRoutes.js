import express from "express";
import { generatePayslip, downloadPayslip } from "../controllers/payslipController.js";

const router = express.Router();

router.get("/:employeeId", generatePayslip);
router.get("/download/:employeeId", downloadPayslip);

export default router;
