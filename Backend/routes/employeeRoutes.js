import express from "express";
import { getEmployees } from "../controllers/employeeController.js";

const router = express.Router();

// 🔹 Get all employees
router.get("/", getEmployees);

export default router;

