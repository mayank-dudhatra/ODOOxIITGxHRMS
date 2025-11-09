// ✅ src/api/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // one single /api
  headers: { "Content-Type": "application/json" },
});

export default instance;
