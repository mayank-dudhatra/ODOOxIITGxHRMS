import express from "express";
import { addEmployee, getAllEmployees } from "../controllers/employeeController.js";

const router = express.Router();

// Add new employee
router.post("/", addEmployee);

// Get all employees
router.get("/", getAllEmployees);

export default router;
