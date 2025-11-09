import React from "react";
import { Routes, Route } from "react-router-dom";
import EmployeeDashboard from "./EmployeeDashboard";
import EmployeeAttendance from "./EmployeeAttendance";
import EmployeeLeaves from "./EmployeeLeaves";
import EmployeePayroll from "./EmployeePayroll";
import EmployeeProfile from "./EmployeeProfile";

const EmployeeRoutes = () => (
  <Routes>
    {/* The paths are now relative to the parent path /employee */}
    <Route path="dashboard" element={<EmployeeDashboard />} /> 
    <Route path="attendance" element={<EmployeeAttendance />} />
  <Route path="leaves" element={<EmployeeLeaves />} /> 
    <Route path="payroll" element={<EmployeePayroll />} />
    <Route path="profile" element={<EmployeeProfile />} />
    <Route index element={<EmployeeDashboard />} /> {/* This ensures /employee navigates to the dashboard */}
  </Routes>
);

export default EmployeeRoutes;