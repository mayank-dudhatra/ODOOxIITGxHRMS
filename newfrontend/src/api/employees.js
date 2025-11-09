// ✅ src/api/employees.js
import axios from "./axiosConfig";

// Fetch all employees
export const getEmployees = async () => {
  return axios.get("/employees"); // Note: /employees (not /api/employees)
};

<<<<<<< HEAD
// (Optional) Get one employee by ID
export const getEmployeeById = async (id) => {
  return axios.get(`/employees/${id}`);
};

// (Optional) Add a new employee
export const addEmployee = async (data) => {
  return axios.post("/employees", data);
};
=======
export const getEmployees = () => axios.get("/employees"); // FIXED

export const addEmployee = (employeeData) => 
  axios.post("/employees", employeeData); // FIXED
>>>>>>> 16acfdf130ca482215ab6c112ccea0e10de4036c
