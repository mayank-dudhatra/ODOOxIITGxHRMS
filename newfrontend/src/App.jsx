import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import EmployeeRoutes from "./pages/dashboards/employee/pages/EmployeeRoutes";
import Layout from "@/components/Layout";
// 🔹 Payroll Officer Pages
import EmployeesPage from "./pages/dashboards/payroll/EmployeesPage";
import ReportsPage from "./pages/dashboards/payroll/ReportsPage";
import AnalyticsPage from "./pages/dashboards/payroll/AnalyticsPage";
import SettingsPage from "./pages/dashboards/payroll/SettingsPage";


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
          
          {/* ─── Payroll Officer Section (Nested with Sidebar) ───── */}
          <Route path="/payroll" element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PayrollDashboard />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          {/* Employee Routes */}
          <Route path="/employee/*" element={<EmployeeRoutes />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;