import axios from "./axiosConfig";

/* ============================================================
   👥 EMPLOYEES MODULE — API HANDLERS
   ============================================================ */

export const getEmployees = () => axios.get("/api/employees");

