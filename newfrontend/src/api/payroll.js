import axios from "./axiosConfig";

/* ============================================================
   🧾 PAYROLL MODULE — API HANDLERS
   ============================================================ */

/* ────────────────────────────────────────────────
   DASHBOARD SUMMARY & LEAVES
──────────────────────────────────────────────── */
export const getPayrollSummary = () => axios.get("/payroll/summary"); // FIXED

// Fetch pending leave requests for payroll officer
export const getPendingLeaves = () => axios.get("/leave/pending"); // FIXED

/* ────────────────────────────────────────────────
   PAYROLL PROCESSING
──────────────────────────────────────────────── */
export const getPayrollList = () => axios.get("/payroll"); // FIXED

export const processPayroll = (employeeId) =>
  axios.post(`/payroll/process/${employeeId}`); // FIXED

export const generatePayslip = (employeeId) =>
  axios.get(`/payslip/${employeeId}`); // FIXED

/* ────────────────────────────────────────────────
   REPORTS PAGE (View + Download)
──────────────────────────────────────────────── */
export const getPayrollReports = () => axios.get("/payroll/reports"); // FIXED

export const downloadPayslip = (employeeId) =>
  axios.get(`/payslip/download/${employeeId}`, { responseType: "blob" }); // FIXED

/* ────────────────────────────────────────────────
   SETTINGS PAGE
──────────────────────────────────────────────── */
export const getPayrollSettings = () => axios.get("/payroll/settings"); // FIXED

export const updatePayrollSettings = (data) =>
  axios.put("/payroll/settings", data); // FIXED