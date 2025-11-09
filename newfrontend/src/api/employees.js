import axios from "./axiosConfig";

/* ============================================================
   👥 EMPLOYEES MODULE — API HANDLERS
   ============================================================ */

export const getEmployees = () => axios.get("/employees"); // FIXED

export const addEmployee = (employeeData) => 
  axios.post("/employees", employeeData); // FIXED

// 🔹 FIX: Ensure Admin uses the central /api/attendance route.
export const getAdminAttendanceRecords = () => axios.get("/attendance");