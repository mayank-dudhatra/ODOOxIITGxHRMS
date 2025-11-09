// src/api/hr.js

import api from "./axiosConfig";

/* ============================================================
   👤 HR MODULE — API HANDLERS
   Base URL: /api/hr
   ============================================================ */

// --- Employee Management ---
// GET /api/hr/employees
export const getHREmployees = () => api.get("/hr/employees");

// GET /api/hr/employees/:id
export const getHREmployeeProfile = (id) => api.get(`/hr/employees/${id}`);

// PATCH /api/hr/employees/:id
export const updateHREmployeeProfile = (id, data) => api.patch(`/hr/employees/${id}`, data);

// --- Leave Management ---
// GET /api/hr/leaves (for all leaves)
export const getHRLeaveRequests = () => api.get("/hr/leaves");

// PATCH /api/hr/leaves/:id/approve
export const approveHRLeave = (id) => api.patch(`/hr/leaves/${id}/approve`);

// PATCH /api/hr/leaves/:id/reject
export const rejectHRLeave = (id) => api.patch(`/hr/leaves/${id}/reject`);

// --- Attendance Management (FIXED to use central /api/attendance route) ---
// POST /api/attendance/mark
export const markAttendance = (data) => api.post("/attendance/mark", data);

// GET /api/attendance or /api/attendance/:employeeId
// FIX: Using central "/attendance" route.
export const getAttendanceRecords = (employeeId) => 
  employeeId ? api.get(`/attendance/${employeeId}`) : api.get("/attendance");

// PATCH /api/attendance/:id
export const updateAttendance = (id, data) => api.patch(`/attendance/${id}`, data);

// DELETE /api/attendance/:id
export const deleteAttendance = (id) => api.delete(`/attendance/${id}`);