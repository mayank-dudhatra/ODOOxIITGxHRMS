import axios from "./axiosConfig";

/* ============================================================
   📊 ANALYTICS MODULE — API HANDLERS
   ============================================================ */

export const getAnalytics = () => axios.get("/analytics"); // FIXED