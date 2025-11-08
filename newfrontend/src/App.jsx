import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Fix the import line
import { AuthProvider } from "./context/AuthContext";

// Auth Pages
import CompanyRegister from "./pages/CompanyRegister";
import Login from "./pages/Login";

// --- NEW ADMIN PAGES ---
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
import PayrollDashboard from "./pages/dashboards/payroll/PayrollDashboard"; // Corrected to point to Payroll Officer Dashboard
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";

function App() {
  return (
    // FIX 1: Use BrowserRouter here, which is what is aliased as Router in the import.
    <Router> 
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<CompanyRegister />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes (CompanyAdmin) */}
          <Route path="/company/dashboard" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="hr" element={<HRManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="leaves" element={<LeaveManagement />} />
            <Route path="payroll" element={<PayrollManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* HR Routes */}
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/employees" element={<Employees />} />
          <Route path="/hr/attendance" element={<Attendence />} />
          <Route path="/hr/leaves" element={<Leaves />} />
          
          {/* Payroll Routes */}
          {/* Using the detailed PayrollDashboard for the Payroll Officer */}
          <Route path="/payroll/dashboard" element={<PayrollDashboard />} /> 
          
          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;