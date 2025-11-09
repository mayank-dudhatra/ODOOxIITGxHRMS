import axios from "./axiosConfig";

<<<<<<< HEAD
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
=======
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
>>>>>>> 16acfdf130ca482215ab6c112ccea0e10de4036c

// ⚙️ Process payroll for one employee
export const processPayroll = (employeeId) =>
<<<<<<< HEAD
  axios.post(`/payroll/process/${employeeId}`);
=======
  axios.post(`/payroll/process/${employeeId}`); // FIXED
>>>>>>> 16acfdf130ca482215ab6c112ccea0e10de4036c

// 📄 Generate payslip (preview)
export const generatePayslip = (employeeId) =>
<<<<<<< HEAD
  axios.get(`/payslip/${employeeId}`);
=======
  axios.get(`/payslip/${employeeId}`); // FIXED

/* ────────────────────────────────────────────────
   REPORTS PAGE (View + Download)
──────────────────────────────────────────────── */
export const getPayrollReports = () => axios.get("/payroll/reports"); // FIXED
>>>>>>> 16acfdf130ca482215ab6c112ccea0e10de4036c

// 💾 Download Payslip (PDF)
export const downloadPayslip = (employeeId) =>
<<<<<<< HEAD
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
=======
  axios.get(`/payslip/download/${employeeId}`, { responseType: "blob" }); // FIXED

/* ────────────────────────────────────────────────
   SETTINGS PAGE
──────────────────────────────────────────────── */
export const getPayrollSettings = () => axios.get("/payroll/settings"); // FIXED

export const updatePayrollSettings = (data) =>
  axios.put("/payroll/settings", data); // FIXED
>>>>>>> 16acfdf130ca482215ab6c112ccea0e10de4036c
