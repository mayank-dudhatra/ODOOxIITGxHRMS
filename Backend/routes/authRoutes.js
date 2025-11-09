import express from "express";
import { createUser, login, changePassword } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin / HR create user
// NOTE: Temporarily disabling authMiddleware for development/testing if user creation is needed without auth context
router.post("/create", /* authMiddleware, roleMiddleware("Admin", "HR"), */ createUser);
// Login - This is the route for Employee/HR/Payroll login
router.post("/login", login);

// Change Password
router.put("/change-password", authMiddleware, changePassword);

export default router;