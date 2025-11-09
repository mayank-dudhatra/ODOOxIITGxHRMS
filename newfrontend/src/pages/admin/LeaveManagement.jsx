import React, { useState, useEffect } from 'react';
import { FiCalendar, FiSearch, FiRefreshCcw, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
// NOTE: Running purely on frontend with dummy data

// --- 1. DUMMY DATA ---
const DUMMY_RECORDS = [
    {
        _id: 'l001',
        employeeName: 'Aarav Sharma',
        employeeId: 'LOIEM0001',
        leaveType: 'Sick',
        startDate: '2025-11-10',
        endDate: '2025-11-10',
        reason: 'Severe fever, doctor advised rest.',
        status: 'Pending',
    },
    {
        _id: 'l002',
        employeeName: 'Priya Verma',
        employeeId: 'LOIHR0002',
        leaveType: 'Casual',
        startDate: '2025-12-24',
        endDate: '2025-12-26',
        reason: 'Family wedding trip out of state.',
        status: 'Pending',
    },
    {
        _id: 'l003',
        employeeName: 'John Doe',
        employeeId: 'LOIPR0003',
        leaveType: 'Earned',
        startDate: '2025-10-01',
        endDate: '2025-10-05',
        reason: 'Annual vacation to the mountains.',
        status: 'Approved',
    },
    {
        _id: 'l004',
        employeeName: 'Sarah Connor',
        employeeId: 'LOIEM0004',
        leaveType: 'Other',
        startDate: '2025-11-09',
        endDate: '2025-11-09',
        reason: 'Bank appointment.',
        status: 'Rejected',
    },
];

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' 
    });
};

// Helper to get status badge styling
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

// Helper to calculate duration (inclusive of start/end dates)
const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const durationDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return `${durationDays} Day${durationDays > 1 ? 's' : ''}`;
};


const LeaveManagement = () => {
    const [allLeaves, setAllLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // --- 2. Local Data Fetch and Filter Logic ---
    const applyFilters = (data) => {
        let filtered = data;
        
        // Filter by Text (Name or ID)
        if (filterText) {
            const lowerText = filterText.toLowerCase();
            filtered = filtered.filter(leave => 
                leave.employeeName.toLowerCase().includes(lowerText) ||
                leave.employeeId.toLowerCase().includes(lowerText)
            );
        }

        // Filter by Status
        if (filterStatus) {
            filtered = filtered.filter(leave => leave.status === filterStatus);
        }
        
        return filtered;
    }

    const fetchLeaves = () => {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            // DUMMY_RECORDS is cloned to allow mutations (Approve/Reject)
            const initialData = JSON.parse(localStorage.getItem('dummy_leaves')) || DUMMY_RECORDS;
            
            setAllLeaves(initialData);
            setFilteredLeaves(applyFilters(initialData));
            setLoading(false);
        }, 500); // 500ms delay for demonstration
    };
    
    // Initial load and whenever filters change
    useEffect(() => {
        fetchLeaves();
    }, [filterStatus, filterText]);


    // --- 3. Local Action Handlers (Approve/Reject) ---
    const handleAction = (id, action) => {
        setLoading(true);
        setTimeout(() => {
            const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
            
            const updatedLeaves = allLeaves.map(leave => 
                leave._id === id ? { ...leave, status: newStatus } : leave
            );
            
            // Persist changes to local storage for persistence across component loads
            localStorage.setItem('dummy_leaves', JSON.stringify(updatedLeaves));
            
            setAllLeaves(updatedLeaves);
            setFilteredLeaves(applyFilters(updatedLeaves));
            setLoading(false);
        }, 300);
    };

    // --- Render Table Row ---
    const LeaveRow = ({ leave }) => {
        const isPending = leave.status === 'Pending';
        const duration = calculateDuration(leave.startDate, leave.endDate);

        return (
            <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-900">
                    {leave.employeeName}
                    <p className="text-xs text-gray-500">ID: {leave.employeeId}</p>
                </td>
                <td className="py-3 px-3 capitalize">{leave.leaveType}</td>
                <td className="py-3 px-3">
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({duration})
                </td>
                <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                    </span>
                </td>
                <td className="py-3 px-3 text-sm">{leave.reason.substring(0, 40)}...</td>
                <td className="py-3 px-3 text-right space-x-2 min-w-[150px]">
                    {isPending ? (
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => handleAction(leave._id, 'approve')} 
                                className="text-green-600 hover:text-green-800 p-1 font-medium transition-colors disabled:opacity-50"
                                title="Approve"
                                disabled={loading}
                            >
                                <FiCheckCircle className="inline mr-1" />
                            </button>
                            <button 
                                onClick={() => handleAction(leave._id, 'reject')} 
                                className="text-red-500 hover:text-red-700 p-1 font-medium transition-colors disabled:opacity-50"
                                title="Reject"
                                disabled={loading}
                            >
                                <FiXCircle className="inline mr-1" />
                            </button>
                        </div>
                    ) : (
                        <span className="text-gray-400 italic text-sm">-</span>
                    )}
                </td>
            </tr>
        );
    };


    // --- Main Render ---
    return (
        <div className="p-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <FiCalendar className="text-purple-600" /> Leave Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Viewing dummy leave requests for frontend demonstration.
                    </p>
                </div>
                <button
                    onClick={fetchLeaves}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    <FiRefreshCcw className={loading ? "animate-spin" : ""} /> Refresh Data
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Leave Requests Audit ({filteredLeaves.length} Records)
                </h2>

                {/* Filter Section */}
                <div className="flex flex-wrap items-center gap-4 mb-6 p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <FiSearch className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by Employee Name or ID"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 min-w-[200px]">
                        <label htmlFor="status-filter" className="text-gray-500 text-sm">Status:</label>
                        <select
                            id="status-filter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-full"
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <button 
                        onClick={fetchLeaves} 
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                        disabled={loading}
                    >
                        {loading ? <FiLoader className="animate-spin" /> : <FiSearch />} 
                        {loading ? 'Filtering...' : 'Apply Filters'}
                    </button>
                </div>
                

                {/* Records Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason Preview</th>
                                <th className="py-3 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500"><FiLoader className="animate-spin inline mr-2"/> Fetching data...</td></tr>
                            ) : filteredLeaves.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No leave requests found for the current filter.</td></tr>
                            ) : (
                                filteredLeaves.map(leave => (
                                    <LeaveRow key={leave._id} leave={leave} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveManagement;