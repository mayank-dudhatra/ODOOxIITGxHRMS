import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CompanyRegister from "./pages/CompanyRegister";
import Login from "./pages/Login";
import CompanyDashboard from "./pages/dashboards/CompanyDashboard";
import HRDashboard from "./pages/dashboards/HRDashboard";
import PayrollDashboard from "./pages/dashboards/PayrollDashboard";
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<CompanyRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/payroll/dashboard" element={<PayrollDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
