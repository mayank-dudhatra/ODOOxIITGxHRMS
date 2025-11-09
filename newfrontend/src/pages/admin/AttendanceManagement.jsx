import React, { useState, useEffect } from 'react';
import { FiClock, FiSearch, FiRefreshCcw, FiCalendar, FiLoader } from 'react-icons/fi';
// NOTE: Removed import of { getAdminAttendanceRecords } to run without backend

// --- 1. DUMMY DATA ---
const DUMMY_RECORDS = [
    {
        _id: 'a1b2c3d4e5f6',
        date: '2025-11-08T00:00:00.000Z',
        status: 'Present',
        checkIn: '09:00',
        checkOut: '17:30',
        remarks: '',
        employeeId: {
            _id: 'emp1001',
            loginId: 'LOIEM0001',
            firstName: 'Aarav',
            lastName: 'Sharma',
            email: 'aarav.s@loi.com',
        }
    },
    {
        _id: 'b2c3d4e5f6g7',
        date: '2025-11-08T00:00:00.000Z',
        status: 'Late',
        checkIn: '09:15',
        checkOut: '18:00',
        remarks: 'Traffic delay',
        employeeId: {
            _id: 'emp1002',
            loginId: 'LOIEM0002',
            firstName: 'Priya',
            lastName: 'Verma',
            email: 'priya.v@loi.com',
        }
    },
    {
        _id: 'c3d4e5f6g7h8',
        date: '2025-11-07T00:00:00.000Z',
        status: 'Absent',
        checkIn: null,
        checkOut: null,
        remarks: 'Uninformed leave',
        employeeId: {
            _id: 'emp1001',
            loginId: 'LOIEM0001',
            firstName: 'Aarav',
            lastName: 'Sharma',
            email: 'aarav.s@loi.com',
        }
    },
    {
        _id: 'd4e5f6g7h8i9',
        date: '2025-11-07T00:00:00.000Z',
        status: 'On Leave',
        checkIn: null,
        checkOut: null,
        remarks: 'Sick leave approved',
        employeeId: {
            _id: 'emp1003',
            loginId: 'LOIHR0001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.d@loi.com',
        }
    },
    {
        _id: 'e5f6g7h8i9j0',
        date: '2025-11-08T00:00:00.000Z',
        status: 'Present',
        checkIn: '08:45',
        checkOut: '17:15',
        remarks: '',
        employeeId: {
            _id: 'emp1004',
            loginId: 'LOIPR0001',
            firstName: 'Sarah',
            lastName: 'Connor',
            email: 'sarah.c@loi.com',
        }
    }
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

// Helper function to format time strings (stored as HH:MM in DB)
const formatTimeDisplay = (timeString) => {
    if (!timeString) return 'N/A';
    try {
        const dummyDate = `2000-01-01T${timeString}:00`;
        return new Date(dummyDate).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch {
        return timeString;
    }
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'Present':
            return 'bg-green-100 text-green-700';
        case 'Late':
            return 'bg-yellow-100 text-yellow-700';
        case 'On Leave':
            return 'bg-blue-100 text-blue-700';
        case 'Absent':
        default:
            return 'bg-red-100 text-red-700';
    }
};


const AttendanceManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Keep error state for dummy errors
    const [filterId, setFilterId] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // --- 2. UPDATED Fetch Records (Local Filtering) ---
    const fetchRecords = () => {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        setTimeout(() => {
            let data = DUMMY_RECORDS;

            // Apply filters
            if (filterId) {
                const searchIdLower = filterId.toLowerCase();
                data = data.filter(record => {
                    const emp = record.employeeId;
                    return emp && (
                        emp.loginId?.toLowerCase().includes(searchIdLower) ||
                        emp.firstName?.toLowerCase().includes(searchIdLower) ||
                        emp.lastName?.toLowerCase().includes(searchIdLower)
                    );
                });
            }
            
            if (filterDate) {
                // Normalize filter date to check against the start-of-day date in dummy data
                const targetDate = new Date(filterDate).toISOString().substring(0, 10);
                data = data.filter(record => 
                    record.date?.substring(0, 10) === targetDate
                );
            }

            // Sort data by date descending
            data.sort((a, b) => new Date(b.date) - new Date(a.date));

            setRecords(data);
            setLoading(false);
        }, 500); // 500ms delay for demonstration
    };

    // Load initial data on component mount
    useEffect(() => {
        fetchRecords();
    }, []); 

    // Handle filter changes
    const handleFilterChange = (e) => setFilterId(e.target.value);
    const handleDateChange = (e) => setFilterDate(e.target.value);

    // --- Render Table Row ---
    const AttendanceRow = ({ record }) => {
        const employeeName = record.employeeId?.firstName && record.employeeId?.lastName 
            ? `${record.employeeId.firstName} ${record.employeeId.lastName}` 
            : 'N/A';
        
        const checkInDisplay = formatTimeDisplay(record.checkIn);
        const checkOutDisplay = formatTimeDisplay(record.checkOut);

        const statusClass = getStatusBadge(record.status);
        
        return (
            <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-900">
                    {employeeName}
                    <p className="text-xs text-gray-500">ID: {record.employeeId?.loginId || 'N/A'}</p>
                </td>
                <td className="py-3 px-3">{formatDate(record.date)}</td>
                <td className="py-3 px-3">{checkInDisplay}</td>
                <td className="py-3 px-3">{checkOutDisplay}</td>
                <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClass}`}>
                        {record.status}
                    </span>
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">{record.remarks || '-'}</td>
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
                        <FiClock className="text-blue-600" /> Attendance Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Viewing dummy attendance records for frontend demonstration.
                    </p>
                </div>
                <button
                    onClick={() => { fetchRecords(); }}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    <FiRefreshCcw className={loading ? "animate-spin" : ""} /> Refresh Data
                </button>
            </div>

            {error && <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-lg font-medium">{error}</div>}

            <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Attendance Records Audit ({records.length})
                </h2>

                {/* Filter Section */}
                <div className="flex flex-wrap items-center gap-4 mb-6 p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <FiSearch className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by Employee Name or ID"
                            value={filterId}
                            onChange={handleFilterChange}
                            className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 min-w-[200px]">
                        <FiCalendar className="text-gray-500" />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={handleDateChange}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <button 
                        onClick={fetchRecords} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                        disabled={loading}
                    >
                        {loading ? <FiLoader className="animate-spin" /> : <FiSearch />} 
                        {loading ? 'Searching...' : 'Apply Filters'}
                    </button>
                </div>
                

                {/* Records Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && records.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500"><FiLoader className="animate-spin inline mr-2"/> Fetching data...</td></tr>
                            ) : records.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No attendance records found for the current filter.</td></tr>
                            ) : (
                                records.map(record => (
                                    <AttendanceRow key={record._id} record={record} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceManagement;