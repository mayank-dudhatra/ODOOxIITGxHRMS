// src/pages/dashboards/hr/Employees.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../hr/Navbar';
import Sidebar from '../hr/Sidebar';
// [CHANGE] Import API functions from new hr.js
import { getHREmployees, getHREmployeeProfile, updateHREmployeeProfile } from '../../../api/hr'; 
import { FiUsers, FiSearch, FiSave } from 'react-icons/fi'; 

// Mock Base URL is no longer strictly needed but kept for context
const API_BASE_URL = '/hr/employees'; 

// --- Component 1: Employee List Item ---
const EmployeeListItem = ({ employee }) => (
  <li className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex justify-between items-center">
    <div>
      {/* [CHANGE] Use firstName and lastName */}
      <p className="font-semibold text-gray-800">{employee.firstName} {employee.lastName}</p>
      {/* [CHANGE] Use email and role from the User model */}
      <p className="text-sm text-gray-500">{employee.email} ({employee.role})</p>
    </div>
    <small className="text-xs text-gray-400">ID: {employee._id}</small>
  </li>
);

// --- Component 2: HR Employee Management Page (HREmployeeManagementPage) ---
const HREmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [singleEmployee, setSingleEmployee] = useState(null);
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  // [CHANGE] Fields to manage for update
  const [updateData, setUpdateData] = useState({ firstName: '', lastName: '', email: '', role: '' }); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const [userRole] = useState('HR'); 
  const handleLogout = () => navigate('/login');

  // GET /employees: Fetch All Employees
  const fetchAllEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      // [CHANGE] Use the dedicated axios API function
      const response = await getHREmployees(); 
      setEmployees(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching employee list.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // GET /employees/:id: Fetch Single Employee
  const fetchSingleEmployee = async () => {
    if (!employeeIdInput) return;
    setLoading(true);
    setError(null);
    setSingleEmployee(null); 
    try {
      // [CHANGE] Use the dedicated axios API function
      const response = await getHREmployeeProfile(employeeIdInput);
      const data = response.data;
      setSingleEmployee(data);
      // [CHANGE] Map response data to update form state
      setUpdateData({ 
        firstName: data.firstName, 
        lastName: data.lastName,
        email: data.email,
        role: data.role,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Employee not found or failed to fetch profile.');
      setSingleEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  // PATCH /employees/:id: Update Employee Info
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!singleEmployee) return;
    setLoading(true);
    setError(null);

    const allowedUpdates = {};
    // [CHANGE] Check and set updates for firstName, lastName, email, role
    if (updateData.firstName.trim() !== singleEmployee.firstName) allowedUpdates.firstName = updateData.firstName;
    if (updateData.lastName.trim() !== singleEmployee.lastName) allowedUpdates.lastName = updateData.lastName;
    if (updateData.email.trim() !== singleEmployee.email) allowedUpdates.email = updateData.email;
    if (updateData.role.trim() !== singleEmployee.role) allowedUpdates.role = updateData.role;

    if (Object.keys(allowedUpdates).length === 0) {
      setError('No valid changes detected for update.');
      setLoading(false);
      return;
    }

    try {
      // [CHANGE] Use the dedicated axios API function
      const response = await updateHREmployeeProfile(singleEmployee._id, allowedUpdates);

      setSingleEmployee(response.data.employee);
      alert(response.data.message); 
      if (employees.length > 0) fetchAllEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating employee profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={userRole} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <Navbar role={userRole} userName="Sarah Connor" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Employee Directory & Management</h1>
          <p className="text-gray-500 mb-8">View and manage all employee profiles and records.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* --- Section 1: View All Employees (GET /employees) --- */}
            <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200 h-fit">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiUsers className="text-blue-500" /> All Employees List
              </h2>
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                onClick={fetchAllEmployees} 
                disabled={loading}
              >
                {loading ? 'Fetching...' : 'Fetch All Employees'}
              </button>
              
              <div className="mt-4 border-t pt-4">
                <ul className="list-none p-0 space-y-1 max-h-96 overflow-y-auto">
                  {employees.map((emp) => (
                    <EmployeeListItem key={emp._id} employee={emp} /> 
                  ))}
                  {employees.length === 0 && !loading && (
                    <p className="text-center text-gray-500 italic p-4">No employees loaded.</p>
                  )}
                </ul>
              </div>
            </div>

            {/* --- Section 2: View/Update Single Employee (GET & PATCH /employees/:id) --- */}
            <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiSearch className="text-green-500" /> Employee Profile Search
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Enter Employee ID"
                  value={employeeIdInput}
                  onChange={(e) => setEmployeeIdInput(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  onClick={fetchSingleEmployee} 
                  disabled={loading}
                >
                  View Profile
                </button>
              </div>

              {error && <p className="text-red-500 font-medium my-4 p-3 bg-red-50 rounded-lg">Error: {error}</p>}

              {singleEmployee && (
                <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Profile Details</h3>
                  <p className="text-sm">ID: <code className="text-gray-600 bg-gray-100 p-1 rounded">{singleEmployee.loginId}</code></p>
                  <p className="font-semibold text-gray-800">Name: {singleEmployee.firstName} {singleEmployee.lastName}</p>
                  <p className="text-gray-600">Email: {singleEmployee.email}</p>
                  <p className="text-gray-600">Role: {singleEmployee.role}</p>
                  
                  {/* --- Update Form (PATCH /employees/:id) --- */}
                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <h4 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                        <FiSave /> Update Employee Info
                      </h4>
                      
                      {/* [CHANGE] Use firstName */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">First Name:</label>
                        <input
                          type="text"
                          value={updateData.firstName}
                          onChange={(e) => setUpdateData({ ...updateData, firstName: e.target.value })}
                          className="p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      
                      {/* [CHANGE] Use lastName */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Last Name:</label>
                        <input
                          type="text"
                          value={updateData.lastName}
                          onChange={(e) => setUpdateData({ ...updateData, lastName: e.target.value })}
                          className="p-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      {/* [CHANGE] Use email */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Email:</label>
                        <input
                          type="email"
                          value={updateData.email}
                          onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                          className="p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      
                      {/* [CHANGE] Use role */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Role:</label>
                        <select
                          value={updateData.role}
                          onChange={(e) => setUpdateData({ ...updateData, role: e.target.value })}
                          className="p-2 border border-gray-300 rounded-lg"
                        >
                          <option value="HR">HR</option>
                          <option value="Payroll">Payroll</option>
                          <option value="Employee">Employee</option>
                        </select>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Save Changes (PATCH)'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HREmployeeManagementPage;