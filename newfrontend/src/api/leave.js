import axios from "./axiosConfig";

// Fetch pending leaves
export const getPendingLeaves = () => axios.get("/api/leave/pending");

// Approve leave
export const approveLeave = (id) => axios.post(`/api/leave/approve/${id}`);

// Reject leave
export const rejectLeave = (id) => axios.post(`/api/leave/reject/${id}`);
