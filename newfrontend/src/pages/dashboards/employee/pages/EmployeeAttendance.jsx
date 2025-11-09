import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiTrendingUp, FiSettings, FiBarChart } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import EmployeeLayout from '../layouts/EmployeeLayout';

// --- DUMMY DATA & HELPERS (New implementation) ---

const initialRecords = [
    // Current week data for the chart (reversed order for chart display)
    { date: "Nov-09", status: "Absent", check_in: null, check_out: null, hours: "-", rechartsValue: 0, fillColor: "#EF4444" },
    { date: "Nov-08", status: "Present", check_in: "09:00 AM", check_out: "05:00 PM", hours: "8.0", rechartsValue: 1, fillColor: "#10B981" },
    { date: "Nov-07", status: "Present", check_in: "09:10 AM", check_out: "05:10 PM", hours: "8.0", rechartsValue: 1, fillColor: "#10B981" },
    { date: "Nov-06", status: "Present", check_in: "09:05 AM", check_out: "05:45 PM", hours: "8.7", rechartsValue: 1, fillColor: "#10B981" },
    { date: "Nov-05", status: "Leave", check_in: null, check_out: null, hours: "-", rechartsValue: 0.5, fillColor: "#FBBF24" },
    { date: "Nov-04", status: "Present", check_in: "09:00 AM", check_out: "05:00 PM", hours: "8.0", rechartsValue: 1, fillColor: "#10B981" },
    { date: "Nov-03", status: "Present", check_in: "09:30 AM", check_out: "06:00 PM", hours: "8.5", rechartsValue: 1, fillColor: "#10B981" },
    // Older records for summary calculation
    { date: "Nov-02", status: "Absent", check_in: null, check_out: null, hours: "-", rechartsValue: 0, fillColor: "#EF4444" },
    { date: "Nov-01", status: "Present", check_in: "09:00 AM", check_out: "05:00 PM", hours: "8.0", rechartsValue: 1, fillColor: "#10B981" },
    { date: "Oct-30", status: "Present", check_in: "09:00 AM", check_out: "05:00 PM", hours: "8.0", rechartsValue: 1, fillColor: "#10B981" },
    { date: "Oct-29", status: "Present", check_in: "09:00 AM", check_out: "05:00 PM", hours: "8.0", rechartsValue: 1, fillColor: "#10B981" },
];

const calculateSummary = (records) => {
    const present_days = records.filter(r => r.status === 'Present').length;
    const absent_days = records.filter(r => r.status === 'Absent').length;
    const leave_days = records.filter(r => r.status === 'Leave').length;
    const total_working_days = present_days + absent_days + leave_days;
    const percentage = total_working_days > 0 ? (present_days / total_working_days) * 100 : 0;

    // Dummy top active days (mocked data)
    const top_active_days = [
        { date: "Nov-06", hours_display: "8h 45m" },
        { date: "Nov-03", hours_display: "8h 30m" },
        { date: "Nov-07", hours_display: "8h 00m" },
    ];

    return {
        present_days,
        absent_days,
        leave_days,
        attendance_percentage: percentage.toFixed(1) + '%',
        top_active_days,
    };
};

// --- COMPONENTS (SummaryCard remains the same) ---
const SummaryCard = ({ title, count, icon, bgColor, iconColor }) => (
    <div className={`p-5 rounded-xl shadow-md border border-gray-100 ${bgColor} transition-shadow hover:shadow-lg`}>
        <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
            <div className={`p-3 rounded-full ${iconColor} bg-white bg-opacity-30`}>{icon}</div>
        </div>
        <p className="text-4xl font-bold mt-2 text-gray-800">{count}</p>
    </div>
);


const EmployeeAttendance = () => {
    const user = { fullName: "Arjun Divraniya" };
    const today = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    
    // --- State for Data and UI ---
    const [detailedRecords, setDetailedRecords] = useState(initialRecords);
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('OUT'); // 'IN', 'OUT', or 'LOADING'
    const [statusMessage, setStatusMessage] = useState("Click 'Check In' to start your day.");


    // --- Attendance Data Calculation ---
    const summaryData = useMemo(() => calculateSummary(detailedRecords), [detailedRecords]);
    
    // Use the last 7 days for the chart
    const chartData = detailedRecords.slice(0, 7).reverse(); 
    
    // --- Dummy Mark Attendance Handler (Replaces API call) ---
    const handleMarkAttendance = (action) => {
        if (loading) return;
        
        setLoading(true);
        
        // Simulate a network delay
        setTimeout(() => {
            if (action === 'check_in') {
                const now = new Date();
                const checkInTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                
                // Add a dummy 'Present' record for today (Date format 'Nov-09')
                const newRecord = { 
                    date: today.replace(/ /g, '-'), 
                    status: "Present", 
                    check_in: checkInTime, 
                    check_out: null, 
                    hours: "-", 
                    rechartsValue: 1, 
                    fillColor: "#10B981" 
                };
                
                // Ensure we don't duplicate the entry if already present
                const existingIndex = detailedRecords.findIndex(r => r.date === newRecord.date);
                if (existingIndex === -1) {
                    setDetailedRecords([newRecord, ...detailedRecords]);
                } else {
                    // Update the existing record (e.g., if re-checking in after an error)
                    const updatedRecords = [...detailedRecords];
                    updatedRecords[existingIndex] = { ...updatedRecords[existingIndex], check_in: checkInTime, status: "Present" };
                    setDetailedRecords(updatedRecords);
                }
                
                setCurrentStatus('IN');
                setStatusMessage(`Checked In successfully at ${checkInTime}.`);

            } else if (action === 'check_out') {
                const now = new Date();
                const checkOutTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                
                // Find today's record and update check_out and hours
                const updatedRecords = detailedRecords.map(record => {
                    if (record.date === today.replace(/ /g, '-')) {
                        // Dummy calculation for 8 hours of work
                        const hours = (Math.random() * (9 - 7.5) + 7.5).toFixed(1); 
                        return {
                            ...record,
                            check_out: checkOutTime,
                            hours: hours,
                        };
                    }
                    return record;
                });
                
                setDetailedRecords(updatedRecords);
                setCurrentStatus('OUT');
                setStatusMessage(`Checked Out successfully at ${checkOutTime}. See you tomorrow!`);
            }
            
            setLoading(false);
        }, 800); // Simulate network latency
    };


    // --- UI Status Message Logic (Simplified) ---
    useEffect(() => {
        let color = "text-gray-600";
        let msg = statusMessage;
        if (currentStatus === 'IN') {
             color = "text-green-600 font-semibold";
             msg = `You are currently **Checked In**.`;
        } else if (currentStatus === 'OUT') {
             color = "text-red-600 font-semibold";
             msg = statusMessage; // Use the message set by the handler
        } else if (currentStatus === 'LOADING') {
             color = "text-yellow-600 font-semibold";
             msg = "Processing request...";
        }
        
        // Update the status message and color
        const statusSpan = document.getElementById('status-message-span');
        if(statusSpan) {
             statusSpan.className = `text-sm mb-4 ${color}`;
             statusSpan.innerHTML = `Current Status: **${msg.replace(/\*\*/g, '')}**`; // Remove redundant bold marks
        }
    }, [currentStatus, statusMessage]);


    // --- State for Filters (local state only, no data filtering applied in this mock) ---
    const [filterPeriod, setFilterPeriod] = useState('Month');
    const [startDate, setStartDate] = useState(new Date("2025-11-01").toISOString().substring(0, 10));
    const [endDate, setEndDate] = useState(new Date("2025-11-30").toISOString().substring(0, 10));

    // --- Main Render ---
    return (
        <EmployeeLayout user={user}>
            {loading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
                    <div className="text-lg font-bold text-blue-600">Loading Dashboard Data...</div>
                </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 font-poppins">
                    <FiClock className="text-blue-600" /> Employee Attendance Panel
                </h1>
                <p className="text-sm text-gray-500">Today: {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>

            {/* 1. ATTENDANCE ACTIONS SECTION & ANALYTICS */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* 1.1 Mark Attendance Card */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Mark Attendance</h2>
                    <p id="status-message-span" className="text-sm mb-4 text-gray-600">
                        Current Status: **{statusMessage}**
                    </p>
                    
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleMarkAttendance('check_in')}
                            disabled={currentStatus !== 'OUT' || loading}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                ${currentStatus === 'OUT' ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg' : 'bg-gray-400'}`}
                        >
                            <FiCheckCircle /> Check In
                        </button>

                        <button
                            onClick={() => handleMarkAttendance('check_out')}
                            disabled={currentStatus !== 'IN' || loading}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                ${currentStatus === 'IN' ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg' : 'bg-gray-400'}`}
                        >
                            <FiXCircle /> Check Out
                        </button>
                    </div>
                </div>

                {/* 1.2 Attendance Percentage Card */}
                <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 lg:col-span-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Attendance Percentage</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                            <div className="w-full h-full rounded-full bg-gray-200 absolute"></div>
                            <div className="w-full h-full rounded-full absolute" style={{ 
                                background: `conic-gradient(#2563EB ${parseFloat(summaryData.attendance_percentage) * 3.6}deg, #E5E7EB 0deg)`
                            }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-blue-600 bg-white m-1 rounded-full">{summaryData.attendance_percentage}</span>
                        </div>
                        <div className="text-sm">
                            <p className="text-green-600 font-bold">
                                {parseFloat(summaryData.attendance_percentage) >= 90 ? 'Excellent Consistency! 🎉' : 'Keep up the good work!'}
                            </p>
                            <p className="text-gray-500 mt-1">
                                Based on {summaryData.present_days + summaryData.absent_days + summaryData.leave_days} total working days.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* 1.3 Top Days Card */}
                <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 lg:col-span-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Top 3 Active Days</h2>
                    <ul className="space-y-2 text-sm text-gray-600">
                        {summaryData.top_active_days.map((day, index) => (
                            <li key={index} className="flex justify-between items-center border-b pb-1 last:border-b-0">
                                <span className="font-medium text-gray-700">{day.date}</span>
                                <span className="text-blue-600 font-bold">{day.hours_display}</span>
                            </li>
                        ))}
                         {summaryData.top_active_days.length === 0 && <li>No active days recorded yet.</li>}
                    </ul>
                </div>
            </div>

            {/* 2. ATTENDANCE SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <SummaryCard title="Present Days" count={summaryData.present_days} icon={<FiCheckCircle className="text-3xl" />} bgColor="bg-green-100" iconColor="text-green-600"/>
                <SummaryCard title="Absent Days" count={summaryData.absent_days} icon={<FiXCircle className="text-3xl" />} bgColor="bg-red-100" iconColor="text-red-600"/>
                <SummaryCard title="Leave Days" count={summaryData.leave_days} icon={<FiCalendar className="text-3xl" />} bgColor="bg-yellow-100" iconColor="text-yellow-600"/>
            </div>

            {/* 3. ATTENDANCE CHART + FILTER SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 3.1 Filter Bar (Filter logic is mock only) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl border border-gray-200 h-fit">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 font-poppins"><FiSettings /> Filter Records</h2>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Filter Period</label>
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Week">Current Week</option>
                            <option value="Month">Current Month</option>
                            <option value="Year">Current Year</option>
                        </select>
                        
                        <label className="block text-sm font-medium text-gray-700">Date Range (Start)</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        
                        <label className="block text-sm font-medium text-gray-700">Date Range (End)</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />

                        <button onClick={() => alert("Filter applied! (Mock)")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors hover:shadow-lg mt-2 flex items-center justify-center gap-2">
                            <FiBarChart /> Apply Filter
                        </button>
                    </div>
                </div>

                {/* 3.2 Chart Area and Table */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Daily Attendance Chart (Last 7 Days)</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDashArray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis 
                                        dataKey="date" 
                                        tickFormatter={(date) => date.split('-')[0] + ' ' + date.split('-')[1]} 
                                        angle={-45} textAnchor="end" height={60} stroke="#4B5563"
                                    />
                                    <YAxis 
                                        domain={[0, 1.1]} ticks={[0, 0.5, 1]} 
                                        tickFormatter={(val) => val === 1 ? 'Present' : val === 0.5 ? 'Leave' : 'Absent'}
                                        width={60} stroke="#4B5563"
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                        labelFormatter={(label) => `Date: ${label.replace(/-/g, ' ')}`}
                                        formatter={(value, name, props) => [`Status: ${props.payload.status}`, 'Value']}
                                    />
                                    <Bar dataKey="rechartsValue" barSize={20}>
                                        {chartData.map((entry, index) => (
                                            <Bar key={`bar-${index}`} dataKey="rechartsValue" fill={entry.fillColor} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 4. ATTENDANCE TABLE */}
                    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Detailed Attendance Records</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {detailedRecords.map((record) => {
                                        let chipColor = 'bg-gray-200 text-gray-700';
                                        if (record.status === 'Present') chipColor = 'bg-green-100 text-green-700';
                                        if (record.status === 'Absent') chipColor = 'bg-red-100 text-red-700';
                                        if (record.status === 'Leave') chipColor = 'bg-yellow-100 text-yellow-700';

                                        return (
                                            <tr key={record.date} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{record.date.replace(/-/g, ' ')}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{record.check_in || 'N/A'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{record.check_out || 'N/A'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">{record.hours !== '-' ? record.hours : '-'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${chipColor}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ⚡ Bonus Feature: Export Button */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={() => alert('Export functionality coming soon! (Mock)')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
                >
                    Export Report (PDF/CSV)
                </button>
            </div>
        </EmployeeLayout>
    );
};

export default EmployeeAttendance;