import axios from "./axiosConfig";

/* ============================================================
   👥 EMPLOYEES MODULE — API HANDLERS
   ============================================================ */

export const getEmployees = () => axios.get("/employees"); // FIXED

export const addEmployee = (employeeData) => 
  axios.post("/employees", employeeData); // FIXED