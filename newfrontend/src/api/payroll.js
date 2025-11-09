import axios from "./axiosConfig";

/* ======================================================
   📦 PAYROLL API SERVICE
   Handles all payroll-related API requests
   ====================================================== */

// 🧾 Dashboard Summary — total payout, employees paid, etc.
export const getPayrollSummary = () => axios.get("/payroll/summary");

// 📋 Pending leave requests for payroll officer
export const getPendingLeaves = () => axios.get("/leave/pending");

// 💼 Full payroll list (table)
export const getPayrollList = () => axios.get("/payroll");

// ⚙️ Process payroll for one employee
export const processPayroll = (employeeId) =>
  axios.post(`/payroll/process/${employeeId}`);

// 📄 Generate payslip (preview)
export const generatePayslip = (employeeId) =>
  axios.get(`/payslip/${employeeId}`);

// 💾 Download Payslip (PDF)
export const downloadPayslip = (employeeId) =>
  axios.get(`/payslip/${employeeId}/download`, {
    responseType: "blob",
  });

// 📊 Payroll Reports (used in ReportsPage)
export const getPayrollReports = () => axios.get("/payroll/reports");

// ⚙️ Payroll Settings (used in SettingsPage)
export const getPayrollSettings = () => axios.get("/payroll/settings");

// ✏️ Update Payroll Settings (used in SettingsPage)
export const updatePayrollSettings = (settingsData) =>
  axios.put("/payroll/settings", settingsData);
