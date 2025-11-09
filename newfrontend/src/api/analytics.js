import axios from "./axiosConfig";

// 📊 Get overall analytics summary
export const getAnalytics = () => axios.get("/analytics");

<<<<<<< HEAD
// 📈 Get department or payroll analytics
export const getPayrollAnalytics = () => axios.get("/analytics/payroll");

// 🧠 Get HR or attendance analytics
export const getHRAnalytics = () => axios.get("/analytics/hr");
=======
export const getAnalytics = () => axios.get("/analytics"); // FIXED
>>>>>>> 16acfdf130ca482215ab6c112ccea0e10de4036c
