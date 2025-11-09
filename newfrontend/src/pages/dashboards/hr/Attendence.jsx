// src/pages/dashboards/hr/Attendence.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiPlusCircle, FiSearch, FiEdit, FiTrash2, FiSave, FiLoader } from 'react-icons/fi'; 
import Navbar from '../hr/Navbar';
import Sidebar from '../hr/Sidebar';
import { markAttendance, getAttendanceRecords, updateAttendance, deleteAttendance } from './hr'; 

// Helper function to format date/time
const formatDateTime = (dateObject) => {
    if (!dateObject) return 'N/A';
    // Ensure dateObject is a Date instance
    const date = typeof dateObject === 'string' ? new Date(dateObject) : dateObject;
    if (isNaN(date.getTime())) return 'N/A';
    
    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${datePart} ${timePart}`;
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
        date: new Date().toISOString().substring(0, 10), 
        checkIn: new Date().toTimeString().substring(0, 5), 
        checkOut: '', 
        status: 'Present'
    });
    const [isEditing, setIsEditing] = useState(null); 
    const [editData, setEditData] = useState({});

    // Fetch records based on filter ID or all records
    const fetchRecords = async (id = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAttendanceRecords(id); 
            setRecords(response.data);
        } catch (err) {
            setError(err.message || 'Error fetching attendance records from mock API.');
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
            await markAttendance({
                employeeId: newRecordData.employeeId,
                date: newRecordData.date, 
                checkIn: newRecordData.checkIn, 
                checkOut: newRecordData.checkOut || null,
                status: newRecordData.status
            });
            setNewRecordData({ 
                employeeId: '', 
                date: new Date().toISOString().substring(0, 10), 
                checkIn: new Date().toTimeString().substring(0, 5), 
                checkOut: '', 
                status: 'Present'
            });
            fetchRecords(filterId); 
        } catch (err) {
            setError(err.message || 'Failed to mark attendance (Mock). Check Employee ID.');
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
            await updateAttendance(isEditing, editData);
            setIsEditing(null);
            fetchRecords(filterId); 
        } catch (err) {
            setError(err.message || 'Failed to update record (Mock).');
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
            await deleteAttendance(id); 
            fetchRecords(filterId); 
        } catch (err) {
            setError(err.message || 'Failed to delete record (Mock).');
        } finally {
            setLoading(false);
        }
    };
    
    // Start editing a record
    const startEdit = (record) => {
        setEditData({
            checkIn: record.checkIn,
            checkOut: record.checkOut || '',
            date: record.date.substring(0, 10), 
            status: record.status
        });
        setIsEditing(record._id);
    };

    // Render Table Row
    const RecordRow = ({ record }) => {
        const employeeName = record.employeeId?.firstName && record.employeeId?.lastName 
            ? `${record.employeeId.firstName} ${record.employeeId.lastName}` 
            : record.employeeId?.email || record.employeeId || 'N/A';
            
        const isCurrentlyEditing = isEditing === record._id;

        const baseDate = record.date.substring(0, 10);
        const checkInTime = record.checkIn ? `${baseDate}T${record.checkIn}` : null;
        const checkOutTime = record.checkOut ? `${baseDate}T${record.checkOut}` : null;

        let checkInDisplay = checkInTime ? formatDateTime(checkInTime) : 'N/A';
        let checkOutDisplay = checkOutTime ? formatDateTime(checkOutTime) : 'N/A';


        if (isCurrentlyEditing) {
            return (
                <tr className="bg-yellow-50 border-b">
                    <td className="py-3 px-3 font-medium text-gray-900">{employeeName}</td>
                    <td className="py-3 px-3">
                        <input
                            type="date"
                            value={editData.date}
                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                            className="p-1 border rounded text-sm w-full mb-1"
                            required
                        />
                        <input
                            type="time"
                            value={editData.checkIn}
                            onChange={(e) => setEditData({ ...editData, checkIn: e.target.value })}
                            className="p-1 border rounded text-sm w-full"
                            required
                        />
                    </td>
                    <td className="py-3 px-3">
                        <input
                            type="time"
                            value={editData.checkOut}
                            onChange={(e) => setEditData({ ...editData, checkOut: e.target.value })}
                            className="p-1 border rounded text-sm w-full"
                        />
                    </td>
                    <td className="py-3 px-3">
                         <select
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            className="p-1 border rounded text-sm w-full"
                            required
                        >
                            <option value="Present">Present</option>
                            <option value="Late">Late</option>
                            <option value="Absent">Absent</option>
                            <option value="On Leave">On Leave</option>
                        </select>
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
                <td className="py-3 px-3">{checkInDisplay}</td>
                <td className="py-3 px-3">{checkOutDisplay}</td>
                <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        record.status === 'Present' ? 'bg-green-100 text-green-700' :
                        record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                        {record.status}
                    </span>
                </td>
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

                    {error && <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-lg">Error: {error}</div>}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Column 1: Add New Record */}
                        <div className="lg:col-span-1 bg-white rounded-lg shadow-xl p-6 border border-gray-200 h-fit">
                            <h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
                                <FiPlusCircle /> Manually Mark Attendance
                            </h2>
                            <form onSubmit={handleAddRecord} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Employee ID (e.g., EMP001)"
                                    value={newRecordData.employeeId}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, employeeId: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    value={newRecordData.date}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, date: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                <label className="block text-sm font-medium text-gray-700">Check-In Time</label>
                                <input
                                    type="time"
                                    value={newRecordData.checkIn}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, checkIn: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                <label className="block text-sm font-medium text-gray-700">Check-Out Time (Optional)</label>
                                <input
                                    type="time"
                                    value={newRecordData.checkOut}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, checkOut: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={newRecordData.status}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, status: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="Present">Present</option>
                                    <option value="Late">Late</option>
                                    <option value="Absent">Absent</option>
                                    <option value="On Leave">On Leave</option>
                                </select>
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
                            
                            <div className="flex items-center gap-3 mb-6 p-4 border rounded-lg bg-gray-50">
                                <input
                                    type="text"
                                    placeholder="Filter by Employee ID (e.g., EMP001)"
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
                                            <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                                            <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                                            <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="py-3 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr><td colSpan="5" className="text-center py-4 text-gray-500"><FiLoader className="animate-spin inline mr-2"/> Loading records...</td></tr>
                                        ) : records.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-4 text-gray-500">No attendance records found.</td></tr>
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