import axios from "./axiosConfig";

/* ============================================================
   🧾 PAYROLL MODULE — API HANDLERS
   Handles all API calls for Payroll Officer Dashboard
   ============================================================ */

/* ────────────────────────────────────────────────
   DASHBOARD SUMMARY & LEAVES
──────────────────────────────────────────────── */
export const getPayrollSummary = () => axios.get("/api/payroll/summary");

// Fetch pending leave requests for payroll officer
export const getPendingLeaves = () => axios.get("/api/leave/pending");

/* ────────────────────────────────────────────────
   PAYROLL PROCESSING
──────────────────────────────────────────────── */
export const getPayrollList = () => axios.get("/api/payroll");

export const processPayroll = (employeeId) =>
  axios.post(`/api/payroll/process/${employeeId}`);

export const generatePayslip = (employeeId) =>
  axios.get(`/api/payslip/${employeeId}`);

/* ────────────────────────────────────────────────
   REPORTS PAGE (View + Download)
──────────────────────────────────────────────── */
export const getPayrollReports = () => axios.get("/api/payroll/reports");

export const downloadPayslip = (employeeId) =>
  axios.get(`/api/payslip/download/${employeeId}`, { responseType: "blob" });

/* ────────────────────────────────────────────────
   SETTINGS PAGE
──────────────────────────────────────────────── */
export const getPayrollSettings = () => axios.get("/api/payroll/settings");

export const updatePayrollSettings = (data) =>
  axios.put("/api/payroll/settings", data);
