// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import CompanyRegister from "./pages/CompanyRegister";
// import Login from "./pages/Login";
// import CompanyDashboard from "./pages/dashboards/CompanyDashboard";
// import HRDashboard from "./pages/dashboards/hr/HRDashboard";
// import PayrollDashboard from "./pages/dashboards/PayrollDashboard";
// import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           <Route path="/" element={<CompanyRegister />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/company/dashboard" element={<CompanyDashboard />} />
//           <Route path="hr/dashboard" element={<HRDashboard />} />
//           <Route path="/payroll/dashboard" element={<PayrollDashboard />} />
//           <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Auth Pages
import CompanyRegister from "./pages/CompanyRegister";
import Login from "./pages/Login";

// --- NEW ADMIN PAGES (Import all of them) ---
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import HRManagement from "./pages/admin/HRManagement";
import AttendanceManagement from "./pages/admin/AttendanceManagement";
import LeaveManagement from "./pages/admin/LeaveManagement";
import PayrollManagement from "./pages/admin/PayrollManagement";
import Settings from "./pages/admin/Settings";

// Existing Role Dashboards
import HRDashboard from "./pages/dashboards/hr/HRDashboard";
import PayrollDashboard from "./pages/dashboards/PayrollDashboard";
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";

// We no longer need the old CompanyDashboard
// import CompanyDashboard from "./pages/dashboards/CompanyDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<CompanyRegister />} />
          <Route path="/login" element={<Login />} />

          {/* --- NEW COMPANY ADMIN ROUTE (LAYOUT) --- */}
          {/* This one Route handles all /company/dashboard/... paths */}
          <Route path="/company/dashboard" element={<AdminLayout />}>
            {/* The index route is the dashboard page */}
            <Route index element={<AdminDashboard />} /> 
            {/* All other admin pages are children */}
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="hr" element={<HRManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="leaves" element={<LeaveManagement />} />
            <Route path="payroll" element={<PayrollManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Existing Role-Specific Routes */}
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/payroll/dashboard" element={<PayrollDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;