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
import Employees from "./pages/dashboards/hr/Employees";
import Attendence from "./pages/dashboards/hr/Attendence";
import Leaves from "./pages/dashboards/hr/Leaves";
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
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/employees" element={<Employees />} />
          <Route path="/hr/attendance" element={<Attendence />} />
          <Route path="/hr/leaves" element={<Leaves />} />
          <Route path="/payroll/dashboard" element={<PayrollDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;