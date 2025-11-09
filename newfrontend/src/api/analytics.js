import axios from "./axiosConfig";

// 📊 Get overall analytics summary
export const getAnalytics = () => axios.get("/analytics");

// 📈 Get department or payroll analytics
export const getPayrollAnalytics = () => axios.get("/analytics/payroll");

// 🧠 Get HR or attendance analytics
export const getHRAnalytics = () => axios.get("/analytics/hr");
