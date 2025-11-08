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
  // Replaced boolean 'isCompanyLogin' with a string for selected role
  const [selectedRole, setSelectedRole] = useState("Company");
  const [credentials, setCredentials] = useState({ email: "", password: "", loginId: "" });

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response;
      // If Company tab is selected, use company login
      if (selectedRole === "Company") {
        response = await api.post("/company/login", credentials);
      } 
      // For all other roles, use the general user login
      else {
        response = await api.post("/auth/login", credentials);
      }
      login(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
            onClick={() => setSelectedRole(role)}
          >
            {role}
          </div>
        ))}
      </div>

      <form onSubmit={handleLogin}>
        {isCompanyLogin ? (
          <>
            <h3>Company Admin Login</h3>
            <input type="email" name="email" placeholder="Company Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          </>
        ) : (
          <>
            <h3>{selectedRole} Login</h3>
            <input name="loginId" placeholder="Login ID" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
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