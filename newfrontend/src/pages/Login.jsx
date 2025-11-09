import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState("Company");

  // We separate company and user credentials
  const [companyCreds, setCompanyCreds] = useState({ email: "", password: "" });
  const [userCreds, setUserCreds] = useState({ loginId: "", password: "" });

  const handleCompanyChange = (e) => setCompanyCreds({ ...companyCreds, [e.target.name]: e.target.value });
  const handleUserChange = (e) => setUserCreds({ ...userCreds, [e.target.name]: e.target.value });

  // Resets state when changing login type
  const handleTabClick = (role) => {
    setSelectedRole(role);
    setCompanyCreds({ email: "", password: "" });
    setUserCreds({ loginId: "", password: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response;
      // If Company tab is selected, use company login
      if (selectedRole === "Company") {
        response = await api.post("/company/login", companyCreds);
      }
      // For all other roles, use the general user login
      else {
        if (!userCreds.loginId || !userCreds.password) {
          throw new Error("Login ID and Password are required.");
        }
        response = await api.post("/auth/login", userCreds);
      }
      login(response.data);
    } catch (err) {
      // Improved error handling to show custom message if available
      alert(err.response?.data?.message || err.message || "Login failed");
    }
  };

  const isCompanyLogin = selectedRole === "Company";
  const roles = ["Company", "HR", "Payroll", "Employee"];

  return (
    // Replaced .auth-page with Tailwind classes for centering and styling
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {/* Role Selection Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {roles.map(role => (
            <div
              key={role}
              className={`
                px-4 py-2 cursor-pointer text-sm font-medium transition-colors duration-200 
                ${selectedRole === role 
                  ? 'border-b-2 border-indigo-600 text-indigo-600 bg-gray-50' 
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
              onClick={() => handleTabClick(role)}
            >
              {role}
            </div>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <h3 className="text-xl font-semibold text-center text-gray-700">
            {isCompanyLogin ? "Company Admin Login" : `${selectedRole} Login`}
          </h3>

          {isCompanyLogin ? (
            <>
              {/* Company Inputs */}
              <input
                type="email"
                name="email"
                placeholder="Company Email"
                value={companyCreds.email}
                onChange={handleCompanyChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={companyCreds.password}
                onChange={handleCompanyChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </>
          ) : (
            <>
              {/* General User Inputs */}
              <input
                name="loginId"
                placeholder="Login ID"
                value={userCreds.loginId}
                onChange={handleUserChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userCreds.password}
                onChange={handleUserChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have a company account?{" "}
          <Link 
            to="/" 
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
          >
            Register Your Company
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;