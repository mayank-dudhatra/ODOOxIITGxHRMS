import axios from "./axiosConfig";

// 📊 Get overall analytics summary
export const getAnalytics = () => axios.get("/analytics");

// export const getAnalytics = () => axios.get("/analytics"); // FIXED
