import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // ✅ MongoDB Connection

// 🔹 Import Routes
import companyRoutes from "./routes/companyRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import payslipRoutes from "./routes/payslipRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ Authentication Routes
import hrRoutes from "./routes/hrRoutes.js"; // ✅ HR Routes [NEW]

// 🔹 Load Environment Variables
dotenv.config();

// 🔹 Initialize Express App
const app = express(); // <--- THIS LINE WAS MISSING OR MOVED, CAUSING THE ERROR
const PORT = process.env.PORT || 5000;

// ✅ Connect MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });

// ✅ Middleware Configuration
app.use(
  cors({
    origin: ["http://localhost:5173"], // 👈 React frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes (All Modules)
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/payslip", payslipRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/hr", hrRoutes); // [NEW] Mount HR Routes

// ✅ Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 WorkZen SHRMS API is running successfully!",
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    author: "Team WorkZen",
  });
});

// ✅ 404 Route Handler (Unknown APIs)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error Handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});