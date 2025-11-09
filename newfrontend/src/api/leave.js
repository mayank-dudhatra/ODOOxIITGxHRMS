import axios from "./axiosConfig";

// Fetch pending leaves
export const getPendingLeaves = () => axios.get("/leave/pending"); // FIXED

// Approve leave
export const approveLeave = (id) => axios.post(`/leave/approve/${id}`); // FIXED

// Reject leave
export const rejectLeave = (id) => axios.post(`/leave/reject/${id}`); // FIXED