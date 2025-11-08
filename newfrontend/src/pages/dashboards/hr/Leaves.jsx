// src/pages/dashboards/hr/Leaves.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiSearch, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import Navbar from '../hr/Navbar';
import Sidebar from '../hr/Sidebar';
// [CHANGE] Import API functions from new hr.js
import { getHRLeaveRequests, approveHRLeave, rejectHRLeave } from '../../../api/hr'; 

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
};

// [CHANGE] Check for Capitalized Status values from Mongoose Enum
const getStatusBadge = (status) => {
    switch (status) {
        case 'Approved': 
            return 'bg-green-100 text-green-700';
        case 'Rejected': 
            return 'bg-red-100 text-red-700';
        case 'Pending':
        default:
            return 'bg-yellow-100 text-yellow-700';
    }
};

const HRLeavePage = () => {
    const navigate = useNavigate();
    const [userRole] = useState('HR'); 
    const handleLogout = () => navigate('/login');

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterId, setFilterId] = useState('');

    // Fetch records based on filter ID or all records (GET /leaves & GET /leaves/:employeeId)
    const fetchLeaves = async (id = null) => {
        setLoading(true);
        setError(null);
        try {
            // [CHANGE] Use the dedicated API function
            const response = await getHRLeaveRequests(); 
            
            let filteredData = response.data || [];
            if (id) {
                 // Client-side filter: match ID in employeeId object (populated ID) or employeeName
                filteredData = filteredData.filter(leave => 
                    leave.employeeId?.toString() === id || 
                    leave.employeeId?.loginId === id ||
                    leave.employeeId?.firstName?.toLowerCase().includes(id.toLowerCase()) ||
                    leave.employeeId?.lastName?.toLowerCase().includes(id.toLowerCase())
                );
            }
            
            setLeaves(filteredData);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching leave requests.');
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    };

    // Load all records on component mount
    useEffect(() => {
        fetchLeaves();
    }, []);

    // PATCH /leaves/:id/approve or /leaves/:id/reject
    const updateLeaveStatus = async (id, action) => {
        setLoading(true);
        setError(null);
        try {
            // [CHANGE] Use the dedicated API functions
            if (action === 'approve') {
                await approveHRLeave(id);
            } else {
                await rejectHRLeave(id);
            }
            fetchLeaves(filterId); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${action} leave request.`);
        } finally {
            setLoading(false);
        }
    };
    
    // Render Table Row
    const LeaveRow = ({ leave }) => {
        // [CHANGE] Access names from the populated employeeId object (User model)
        const employeeName = leave.employeeId?.firstName && leave.employeeId?.lastName 
            ? `${leave.employeeId.firstName} ${leave.employeeId.lastName}`
            : leave.employeeName || 'Unknown Employee';
        const employeeEmail = leave.employeeId?.email || 'N/A';
        
        // [CHANGE] Status will be capitalized (Pending, Approved, Rejected)
        const statusClass = getStatusBadge(leave.status);

        const isPending = leave.status === 'Pending'; 

        return (
            <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-900">
                    {employeeName}
                    <p className="text-xs text-gray-500">{employeeEmail}</p>
                </td>
                <td className="py-3 px-3">{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</td>
                <td className="py-3 px-3 capitalize">{leave.leaveType || 'Annual'}</td>
                <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClass}`}>
                        {leave.status}
                    </span>
                </td>
                <td className="py-3 px-3 text-right space-x-2 min-w-[150px]">
                    {isPending ? (
                        <>
                            <button 
                                onClick={() => updateLeaveStatus(leave._id, 'approve')} 
                                className="text-green-600 hover:text-green-800 p-1 font-medium transition-colors"
                                title="Approve"
                            >
                                <FiCheckCircle className="inline mr-1" /> Approve
                            </button>
                            <button 
                                onClick={() => updateLeaveStatus(leave._id, 'reject')} 
                                className="text-red-500 hover:text-red-700 p-1 font-medium transition-colors"
                                title="Reject"
                            >
                                <FiXCircle className="inline mr-1" /> Reject
                            </button>
                        </>
                    ) : (
                        <span className="text-gray-400 italic text-sm">Action Taken</span>
                    )}
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
                        <FiCalendar className="text-purple-600" /> Leave Requests Review
                    </h1>
                    <p className="text-gray-500 mb-8">Manage, approve, or reject employee time-off requests.</p>

                    {error && <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-lg">{error}</div>}

                    <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiSearch /> Filter Requests
                        </h2>
                        
                        <div className="flex items-center gap-3 mb-6 p-4 border rounded-lg bg-gray-50">
                            <input
                                type="text"
                                placeholder="Filter by Employee ID or Name (optional)"
                                value={filterId}
                                onChange={(e) => setFilterId(e.target.value)}
                                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            />
                            <button 
                                onClick={() => fetchLeaves(filterId)} 
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                                disabled={loading}
                            >
                                <FiSearch /> Filter
                            </button>
                            <button 
                                onClick={() => { setFilterId(''); fetchLeaves(); }} 
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                                disabled={loading}
                            >
                                Clear
                            </button>
                        </div>

                        {/* Leave Requests Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                        <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                                        <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Review Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center py-4 text-gray-500"><FiLoader className="animate-spin inline mr-2"/> Loading requests...</td></tr>
                                    ) : leaves.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-4 text-gray-500">No leave requests found.</td></tr>
                                    ) : (
                                        leaves.map(leave => (
                                            <LeaveRow key={leave._id} leave={leave} />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HRLeavePage;