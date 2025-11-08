import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const CompanyRegister = () => {
  const [form, setForm] = useState({
    name: "",
    companyCode: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/company/register", form);
      alert("Company registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering company");
    }
  };

  return (
    <div className="auth-page">
      <h2>Register Your Company (Admin)</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Company Name" onChange={handleChange} required />
        <input name="companyCode" placeholder="Company Code (e.g. LOI)" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CompanyRegister;
