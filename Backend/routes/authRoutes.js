import express from "express";
import { createUser, login, changePassword } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin / HR create user
router.post("/create", authMiddleware, roleMiddleware("Admin", "HR"), createUser);

// Login
router.post("/login", login);

// Change Password
router.put("/change-password", authMiddleware, changePassword);

export default router;
