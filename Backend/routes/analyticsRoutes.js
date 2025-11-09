import express from "express";
import { getAnalyticsSummary } from "../controllers/analyticsController.js";

const router = express.Router();

// Main analytics summary route
router.get("/", getAnalyticsSummary);

// Example subroutes (optional)
router.get("/payroll", (req, res) => res.json({ message: "Payroll analytics working!" }));
router.get("/hr", (req, res) => res.json({ message: "HR analytics working!" }));

export default router;
