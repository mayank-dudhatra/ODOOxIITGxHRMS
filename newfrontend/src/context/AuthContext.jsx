import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    // FIX: Robustly determine role based on response structure
    let role;
    if (data.company) {
        // Admin login
        role = 'Admin'; 
    } else if (data.user && data.user.role) {
        // General User login
        role = data.user.role; 
    } else if (data.role) {
        // Fallback check for root level role
        role = data.role;
    } else {
        console.error("Login data is missing a recognizable role:", data);
        navigate("/login"); 
        return;
    }

    // Redirect based on the determined role
    if (role === 'Admin' || role === 'CompanyAdmin') {
        navigate("/company/dashboard");
    } 
    else if (role === "HR") {
        navigate("/hr/dashboard");
    } 
    else if (role === "Payroll") {
        navigate("/payroll/dashboard");
    } 
    else if (role === "Employee") {
        navigate("/employee/dashboard");
    } 
    else {
      console.error("Login data has an unexpected role value:", role);
      navigate("/login"); 
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};