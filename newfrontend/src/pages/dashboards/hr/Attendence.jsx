import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiPlusCircle, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import Navbar from '../hr/Navbar';
import Sidebar from '../hr/Sidebar';
import api from '../../../api/axiosConfig';

// Mock Base URL for the API
const API_BASE_URL = '/attendance'; 

// Helper function to format date/time
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
};

const HRAttendancePage = () => {
    const navigate = useNavigate();
    const [userRole] = useState('HR'); 
    const handleLogout = () => navigate('/login');

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterId, setFilterId] = useState('');
    const [newRecordData, setNewRecordData] = useState({ 
        employeeId: '', 
        clockInTime: '', 
        clockOutTime: '' 
    });
    const [isEditing, setIsEditing] = useState(null); // ID of the record being edited
    const [editData, setEditData] = useState({});

    // Fetch records based on filter ID or all records
    const fetchRecords = async (id = null) => {
        setLoading(true);
        setError(null);
        try {
            const url = id ? `${API_BASE_URL}/${id}` : API_BASE_URL;
            const response = await api.get(url);
            setRecords(response.data);
        } catch (err) {
            setError('Error fetching attendance records.');
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    // Load all records on component mount
    useEffect(() => {
        fetchRecords();
    }, []);

    // POST /attendance/mark
    const handleAddRecord = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post(`${API_BASE_URL}/mark`, newRecordData);
            setNewRecordData({ employeeId: '', clockInTime: '', clockOutTime: '' });
            fetchRecords(filterId); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark attendance.');
        } finally {
            setLoading(false);
        }
    };

    // PATCH /attendance/:id
    const handleUpdateRecord = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.patch(`${API_BASE_URL}/${isEditing}`, editData);
            setIsEditing(null);
            fetchRecords(filterId); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update record.');
        } finally {
            setLoading(false);
        }
    };

    // DELETE /attendance/:id
    const handleDeleteRecord = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        setLoading(true);
        setError(null);
        try {
            await api.delete(`${API_BASE_URL}/${id}`);
            fetchRecords(filterId); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete record.');
        } finally {
            setLoading(false);
        }
    };
    
    // Start editing a record
    const startEdit = (record) => {
        // Prepare data for editing, ensuring dates are in correct format for input fields
        const clockIn = record.clockInTime ? new Date(record.clockInTime).toISOString().substring(0, 16) : '';
        const clockOut = record.clockOutTime ? new Date(record.clockOutTime).toISOString().substring(0, 16) : '';
        
        setEditData({
            clockInTime: clockIn,
            clockOutTime: clockOut,
        });
        setIsEditing(record._id);
    };

    // Render Table Row
    const RecordRow = ({ record }) => {
        const employeeName = record.employeeId?.name || record.employeeId || 'N/A';
        const isCurrentlyEditing = isEditing === record._id;

        if (isCurrentlyEditing) {
            return (
                <tr className="bg-yellow-50 border-b">
                    <td className="py-3 px-3 font-medium text-gray-900">{employeeName}</td>
                    <td className="py-3 px-3">
                        <input
                            type="datetime-local"
                            value={editData.clockInTime}
                            onChange={(e) => setEditData({ ...editData, clockInTime: e.target.value })}
                            className="p-1 border rounded text-sm w-full"
                        />
                    </td>
                    <td className="py-3 px-3">
                        <input
                            type="datetime-local"
                            value={editData.clockOutTime}
                            onChange={(e) => setEditData({ ...editData, clockOutTime: e.target.value })}
                            className="p-1 border rounded text-sm w-full"
                        />
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                        <button 
                            onClick={handleUpdateRecord} 
                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                            <FiSave className="inline mr-1" /> Save
                        </button>
                        <button 
                            onClick={() => setIsEditing(null)} 
                            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Cancel
                        </button>
                    </td>
                </tr>
            );
        }

        return (
            <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-900">{employeeName}</td>
                <td className="py-3 px-3">{formatDateTime(record.clockInTime)}</td>
                <td className="py-3 px-3">{record.clockOutTime ? formatDateTime(record.clockOutTime) : 'N/A'}</td>
                <td className="py-3 px-3 text-right space-x-2">
                    <button 
                        onClick={() => startEdit(record)} 
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit Record"
                    >
                        <FiEdit className="inline" />
                    </button>
                    <button 
                        onClick={() => handleDeleteRecord(record._id)} 
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Record"
                    >
                        <FiTrash2 className="inline" />
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar role={userRole} onLogout={handleLogout} />

            <div className="flex-1 flex flex-col">
                <Navbar role={userRole} userName="Sarah Connor" />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <FiClock className="text-indigo-600" /> Attendance Records Management
                    </h1>
                    <p className="text-gray-500 mb-8">Manage clock-in and clock-out logs for all employees.</p>

                    {error && <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-lg">{error}</div>}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Column 1: Add New Record */}
                        <div className="lg:col-span-1 bg-white rounded-lg shadow-xl p-6 border border-gray-200 h-fit">
                            <h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
                                <FiPlusCircle /> Manually Mark Attendance
                            </h2>
                            <form onSubmit={handleAddRecord} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Employee ID"
                                    value={newRecordData.employeeId}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, employeeId: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                <label className="block text-sm font-medium text-gray-700">Clock-In Time</label>
                                <input
                                    type="datetime-local"
                                    value={newRecordData.clockInTime}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, clockInTime: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                <label className="block text-sm font-medium text-gray-700">Clock-Out Time (Optional)</label>
                                <input
                                    type="datetime-local"
                                    value={newRecordData.clockOutTime}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, clockOutTime: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button 
                                    type="submit" 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Mark Attendance (POST)'}
                                </button>
                            </form>
                        </div>

                        {/* Column 2 & 3: Records Table and Filter */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiSearch /> Filter & All Records
                            </h2>
                            
                            {/* Filter Section (GET /attendance & GET /attendance/:employeeId) */}
                            <div className="flex items-center gap-3 mb-6 p-4 border rounded-lg bg-gray-50">
                                <input
                                    type="text"
                                    placeholder="Filter by Employee ID (optional)"
                                    value={filterId}
                                    onChange={(e) => setFilterId(e.target.value)}
                                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button 
                                    onClick={() => fetchRecords(filterId)} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                                    disabled={loading}
                                >
                                    <FiSearch /> Filter
                                </button>
                                <button 
                                    onClick={() => { setFilterId(''); fetchRecords(); }} 
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                                    disabled={loading}
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Attendance Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                            <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock-In</th>
                                            <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock-Out</th>
                                            <th className="py-3 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr><td colSpan="4" className="text-center py-4 text-gray-500">Loading records...</td></tr>
                                        ) : records.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-4 text-gray-500">No attendance records found.</td></tr>
                                        ) : (
                                            records.map(record => (
                                                <RecordRow key={record._id} record={record} />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HRAttendancePage;