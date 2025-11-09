import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";

// Simple CSS for the tabs. You can move this to App.css if you want.
const tabStyles = {
  container: {
    display: "flex",
    marginBottom: "1rem",
    borderBottom: "1px solid #ccc",
  },
  tab: {
    padding: "10px 15px",
    cursor: "pointer",
    border: "1px solid transparent",
    borderBottom: "none",
  },
  activeTab: {
    border: "1px solid #ccc",
    borderBottom: "1px solid white",
    borderRadius: "5px 5px 0 0",
    position: "relative",
    bottom: "-1px",
    backgroundColor: "white",
    color: "#242424",
  },
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState("Company");
  
  // --- UPDATED STATE ---
  // We separate company and user credentials
  const [companyCreds, setCompanyCreds] = useState({ email: "", password: "" });
  const [userCreds, setUserCreds] = useState({ loginId: "", password: "" });
  // --- END OF UPDATE ---

  const handleCompanyChange = (e) => setCompanyCreds({ ...companyCreds, [e.target.name]: e.target.value });
  const handleUserChange = (e) => setUserCreds({ ...userCreds, [e.target.name]: e.target.value });

  // --- NEW FUNCTION ---
  // Resets state when changing login type
  const handleTabClick = (role) => {
    setSelectedRole(role);
    setCompanyCreds({ email: "", password: "" });
    setUserCreds({ loginId: "", password: "" });
  };
  // --- END OF NEW FUNCTION ---

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response;
      // If Company tab is selected, use company login
      if (selectedRole === "Company") {
        // --- UPDATED PAYLOAD ---
        response = await api.post("/company/login", companyCreds);
        // --- END OF UPDATE ---
      } 
      // For all other roles, use the general user login
      else {
        // --- UPDATED PAYLOAD ---
        // Ensure loginId is actually populated here
        if (!userCreds.loginId || !userCreds.password) {
          throw new Error("Login ID and Password are required.");
        }
        response = await api.post("/auth/login", userCreds);
        // --- END OF UPDATE ---
      }
      login(response.data);
    } catch (err) {
      // FIX: Improved error handling to show custom message if available
      alert(err.response?.data?.message || err.message || "Login failed");
    }
  };

  const isCompanyLogin = selectedRole === "Company";
  const roles = ["Company", "HR", "Payroll", "Employee"];

  return (
    <div className="auth-page">
      <h2>Login</h2>
      
      {/* Role Selection Tabs */}
      <div style={tabStyles.container}>
        {roles.map(role => (
          <div
            key={role}
            style={{
              ...tabStyles.tab,
              ...(selectedRole === role ? tabStyles.activeTab : {}),
            }}
            // --- UPDATED OnClick ---
            onClick={() => handleTabClick(role)}
            // --- END OF UPDATE ---
          >
            {role}
          </div>
        ))}
      </div>

      <form onSubmit={handleLogin}>
        {isCompanyLogin ? (
          <>
            <h3>Company Admin Login</h3>
            {/* --- UPDATED INPUTS --- */}
            <input type="email" name="email" placeholder="Company Email" value={companyCreds.email} onChange={handleCompanyChange} required />
            <input type="password" name="password" placeholder="Password" value={companyCreds.password} onChange={handleCompanyChange} required />
            {/* --- END OF UPDATE --- */}
          </>
        ) : (
          <>
            <h3>{selectedRole} Login</h3>
            {/* --- FIX: ADDED NAME ATTRIBUTE TO LOGIN ID INPUT --- */}
            <input name="loginId" placeholder="Login ID" value={userCreds.loginId} onChange={handleUserChange} required />
            <input type="password" name="password" placeholder="Password" value={userCreds.password} onChange={handleUserChange} required />
            {/* --- END OF FIX --- */}
          </>
        )}
        <button type="submit">Login</button>
      </form>
      
      <p>
        Don't have a company account?{" "}
        <Link to="/" style={{ cursor: "pointer", color: "blue" }}>
          Register Your Company
        </Link>
      </p>
    </div>
  );
};

export default Login;