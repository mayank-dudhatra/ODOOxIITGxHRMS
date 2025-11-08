// src/pages/dashboards/hr/Employees.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../hr/Navbar';
import Sidebar from '../hr/Sidebar';
import api from '../../../api/axiosConfig'; // Use the configured axios instance
import { FiUsers, FiSearch, FiSave } from 'react-icons/fi'; // Icons for visual appeal

// Mock Base URL for the API
const API_BASE_URL = '/hr/employees'; 

// --- Component 1: Employee List Item ---
// Converted to Tailwind CSS
const EmployeeListItem = ({ employee }) => (
  <li className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex justify-between items-center">
    <div>
      <p className="font-semibold text-gray-800">{employee.name}</p>
      <p className="text-sm text-gray-500">{employee.department}</p>
    </div>
    <small className="text-xs text-gray-400">ID: {employee._id}</small>
  </li>
);

// --- Component 2: HR Employee Management Page (HREmployeeManagementPage) ---
const HREmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [singleEmployee, setSingleEmployee] = useState(null);
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [updateData, setUpdateData] = useState({ name: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  // Mock role and logout for layout integration
  const [userRole] = useState('HR'); 
  const handleLogout = () => navigate('/login');

  // GET /employees: Fetch All Employees
  const fetchAllEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: Using window.fetch for simplicity, but in a real app, use the imported 'api' axios instance.
      const response = await fetch(API_BASE_URL); 
      if (!response.ok) throw new Error('Failed to fetch list.');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError('Error fetching employee list.');
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
      const response = await fetch(`${API_BASE_URL}/${employeeIdInput}`);
      if (response.status === 404) {
        throw new Error('Employee not found.');
      }
      if (!response.ok) throw new Error('Failed to fetch employee.');
      const data = await response.json();
      setSingleEmployee(data);
      setUpdateData({ name: data.name, department: data.department });
    } catch (err) {
      setError(err.message);
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
    if (updateData.name.trim() !== singleEmployee.name) allowedUpdates.name = updateData.name;
    if (updateData.department.trim() !== singleEmployee.department) allowedUpdates.department = updateData.department;

    if (Object.keys(allowedUpdates).length === 0) {
      setError('No valid changes detected for update.');
      setLoading(false);
      return;
    }

    try {
      // NOTE: In a real app, use axios for easier integration with baseURL/auth headers.
      const response = await fetch(`${API_BASE_URL}/${singleEmployee._id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allowedUpdates),
      });

      if (response.status === 404) throw new Error('Employee not found during update.');
      if (!response.ok) throw new Error('Update failed.');

      const result = await response.json();
      setSingleEmployee(result.employee);
      alert(result.message); 
    } catch (err) {
      setError(err.message || 'Error updating employee profile.');
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
          
          {/* Main Content: Two Column Layout */}
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
                  <p className="text-sm">ID: <code className="text-gray-600 bg-gray-100 p-1 rounded">{singleEmployee._id}</code></p>
                  <p className="font-semibold text-gray-800">Name: {singleEmployee.name}</p>
                  <p className="text-gray-600">Department: {singleEmployee.department}</p>
                  
                  {/* --- Update Form (PATCH /employees/:id) --- */}
                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <h4 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                        <FiSave /> Update Employee Info
                      </h4>
                      
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Name:</label>
                        <input
                          type="text"
                          value={updateData.name}
                          onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                          className="p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Department:</label>
                        <input
                          type="text"
                          value={updateData.department}
                          onChange={(e) => setUpdateData({ ...updateData, department: e.target.value })}
                          className="p-2 border border-gray-300 rounded-lg"
                        />
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

// Export the renamed component
export default HREmployeeManagementPage;