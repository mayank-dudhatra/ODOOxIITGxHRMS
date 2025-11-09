// ✅ src/api/employees.js
import axios from "./axiosConfig";

// Fetch all employees
export const getEmployees = async () => {
  return axios.get("/employees"); // Note: /employees (not /api/employees)
};


// (Optional) Get one employee by ID
export const getEmployeeById = async (id) => {
  return axios.get(`/employees/${id}`);
};

// (Optional) Add a new employee



export const addEmployee = (employeeData) => 
  axios.post("/employees", employeeData); // FIXED
