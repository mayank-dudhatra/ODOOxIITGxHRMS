import express from "express";
import { addEmployee, getEmployees } from "../controllers/employeeController.js";

const router = express.Router();

// POST → Add Employee
router.post("/", addEmployee);

// GET → Fetch all Employees
router.get("/", getEmployees);

export default router;
