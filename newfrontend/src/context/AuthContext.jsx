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

  // --- THIS IS THE UPDATED FUNCTION ---
  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    // Check for company login FIRST
    if (data.company) {
      navigate("/company/dashboard");
    } 
    // If not a company, THEN check for user roles
    else if (data.user && data.user.role) {
      const { role } = data.user;
      if (role === "HR") navigate("/hr/dashboard");
      else if (role === "Payroll") navigate("/payroll/dashboard");
      else if (role === "Employee") navigate("/employee/dashboard");
    } else {
      // Fallback in case the data is not in the expected format
      console.error("Login data is not in the expected format:", data);
      navigate("/login"); // Send back to login
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