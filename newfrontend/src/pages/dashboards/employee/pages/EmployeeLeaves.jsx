import React, { useState, useMemo, useEffect } from 'react';
import { FiCalendar, FiSend, FiList, FiTrendingUp, FiCheckCircle, FiXCircle, FiClock , FiPieChart} from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import EmployeeLayout from '../layouts/EmployeeLayout';

// --- MOCK DATA & CONFIG ---
const LEAVE_TYPES = ["Casual", "Sick", "Paid", "Unpaid"];
const MAX_ANNUAL_LEAVES = 20;

// Helper function to calculate the number of days between two dates (inclusive)
const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Check if end date is before start date
    if (endDate < startDate) return 0;

    // Calculate time difference in milliseconds
    const timeDiff = endDate.getTime() - startDate.getTime();
    
    // Convert to days, accounting for both start and end dates
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return days;
};

// Initial mock leaves state
const initialLeaves = [
    { id: 1, type: "Casual", from: "2025-10-01", to: "2025-10-03", days: 3, status: "Approved", reason: "Family event" },
    { id: 2, type: "Sick", from: "2025-11-05", to: "2025-11-06", days: 2, status: "Pending", reason: "Flu symptoms" },
    { id: 3, type: "Paid", from: "2025-09-10", to: "2025-09-12", days: 3, status: "Rejected", reason: "Peak project season" },
    { id: 4, type: "Unpaid", from: "2025-08-15", to: "2025-08-16", days: 2, status: "Approved", reason: "Travel" },
    { id: 5, type: "Casual", from: "2025-12-24", to: "2025-12-26", days: 3, status: "Pending", reason: "Christmas vacation" },
];

const COLORS = {
    Approved: '#10B981', // Green
    Pending: '#FBBF24',  // Yellow
    Rejected: '#EF4444', // Red
    Remaining: '#E2E8F0', // Gray/Neutral
};

// --- COMPONENTS ---

// 1. Summary Card Component
const SummaryCard = ({ title, count, icon: Icon, bgColor, iconColor }) => (
    <div className={`p-5 rounded-xl shadow-md border border-gray-100 transition-shadow hover:shadow-lg ${bgColor}`}>
        <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
            <div className={`p-3 rounded-full ${iconColor} bg-white bg-opacity-30`}>
                <Icon className="text-xl" />
            </div>
        </div>
        <p className="text-4xl font-bold mt-2 text-gray-800">{count}</p>
    </div>
);

const EmployeeLeaves = () => {
    const user = { fullName: "Arjun Divraniya" };
    const [leaves, setLeaves] = useState(initialLeaves);
    const [filterStatus, setFilterStatus] = useState('All');
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        type: 'Casual',
        from: '',
        to: '',
        reason: '',
    });

    const calculatedDays = calculateDays(formData.from, formData.to);

    // --- Dynamic Stats Calculation ---
    const stats = useMemo(() => {
        const approved = leaves.filter(l => l.status === 'Approved').reduce((sum, l) => sum + l.days, 0);
        const pending = leaves.filter(l => l.status === 'Pending').reduce((sum, l) => sum + l.days, 0);
        const rejected = leaves.filter(l => l.status === 'Rejected').reduce((sum, l) => sum + l.days, 0);
        const used = approved + pending + rejected;
        const remaining = Math.max(0, MAX_ANNUAL_LEAVES - approved);
        
        return { approved, pending, rejected, used, remaining };
    }, [leaves]);

    // Chart data based on approved leaves vs total annual leave
    const chartData = useMemo(() => {
        // Filter out zero values for a cleaner chart, unless all are zero
        const data = [
            { name: "Approved", value: stats.approved, fill: COLORS.Approved },
            { name: "Pending", value: stats.pending, fill: COLORS.Pending },
            { name: "Rejected", value: stats.rejected, fill: COLORS.Rejected },
        ].filter(item => item.value > 0);

        // If the array is empty, return a default value to prevent chart error
        return data.length > 0 ? data : [{ name: "No Data", value: 1, fill: COLORS.Remaining }];
    }, [stats]);

    // Progress Bar data (Used vs Remaining)
    const progressData = useMemo(() => {
        const data = [{ name: "Used", value: stats.used, fill: COLORS.Approved }];
        // Only include Remaining if it's greater than zero, to prevent tiny slice errors
        if (stats.remaining > 0) {
            data.push({ name: "Remaining", value: stats.remaining, fill: COLORS.Remaining });
        }
        return data;
    }, [stats]);

    // Filtered data for the table
    const filteredLeaves = useMemo(() => {
        if (filterStatus === 'All') return leaves;
        return leaves.filter(l => l.status === filterStatus);
    }, [leaves, filterStatus]);

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyLeave = (e) => {
        e.preventDefault();
        
        if (calculatedDays <= 0) {
            // Using a simple alert for immediate feedback, per previous examples
            return alert("Please select valid From and To dates.");
        }

        const newLeave = {
            id: leaves.length + 1,
            type: formData.type,
            from: formData.from,
            to: formData.to,
            days: calculatedDays,
            reason: formData.reason,
            status: 'Pending', // Default status on application
        };

        setLeaves(prev => [...prev, newLeave]);
        setFormData({ type: 'Casual', from: '', to: '', reason: '' }); // Reset form
        
        // Show success notification
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    // Render logic for the status chip
    const getStatusChip = (status) => {
        let bgColor, textColor;
        switch (status) {
            case 'Approved':
                bgColor = 'bg-green-100';
                textColor = 'text-green-700';
                break;
            case 'Rejected':
                bgColor = 'bg-red-100';
                textColor = 'text-red-700';
                break;
            case 'Pending':
            default:
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-700';
                break;
        }
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
                {status}
            </span>
        );
    };

    return (
        <EmployeeLayout user={user}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 font-poppins">
                    <FiCalendar className="text-blue-600" /> Employee Leave Management
                </h1>
            </div>

            {/* Success Alert */}
            {showSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
                    <strong className="font-bold mr-2">Success!</strong>
                    <span className="block sm:inline">Leave request applied successfully. It is now pending approval.</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 1. APPLY FOR LEAVE SECTION (Left Column) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl border border-gray-200 h-fit">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 font-poppins">
                        <FiSend className="text-blue-600" /> Apply New Leave
                    </h2>
                    <form onSubmit={handleApplyLeave} className="space-y-4">
                        
                        {/* Leave Type */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                {LEAVE_TYPES.map(type => (
                                    <option key={type} value={type}>{type} Leave</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Pickers */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">From Date</label>
                                <input
                                    type="date"
                                    name="from"
                                    value={formData.from}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">To Date</label>
                                <input
                                    type="date"
                                    name="to"
                                    value={formData.to}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Calculated Days */}
                        <p className="text-sm font-semibold text-gray-800 bg-gray-50 p-2 rounded-lg text-center">
                            Total Days: <span className="text-blue-600">{calculatedDays}</span>
                        </p>

                        {/* Reason */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Brief reason for your absence"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            disabled={calculatedDays <= 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <FiSend /> Apply Leave
                        </button>
                    </form>
                </div>

                {/* 2. LEAVE SUMMARY CARDS (Middle Column) */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard 
                        title="Approved Leaves" 
                        count={stats.approved} 
                        icon={FiCheckCircle} 
                        bgColor="bg-green-100" 
                        iconColor="text-green-600"
                    />
                    <SummaryCard 
                        title="Pending Requests" 
                        count={stats.pending} 
                        icon={FiClock} 
                        bgColor="bg-yellow-100" 
                        iconColor="text-yellow-600"
                    />
                    <SummaryCard 
                        title="Rejected Requests" 
                        count={stats.rejected} 
                        icon={FiXCircle} 
                        bgColor="bg-red-100" 
                        iconColor="text-red-600"
                    />
                    
                    {/* 5. EXTRA ANALYTICS (Leave Utilization) */}
                    <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Leave Utilization</h2>
                        
                        <div className="flex items-center gap-6">
                            {/* Circular Chart */}
                            <div className="relative w-24 h-24">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        {/* Background circle representing the full 20 leaves */}
                                        <Pie
                                            data={[{ name: "Total", value: MAX_ANNUAL_LEAVES, fill: COLORS.Remaining }]}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={45}
                                            fill={COLORS.Remaining}
                                            isAnimationActive={false}
                                        />
                                        {/* Foreground circle representing the used amount */}
                                        <Pie
                                            data={[{ name: "Used", value: stats.used, fill: COLORS.Approved }]}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={35}
                                            outerRadius={45}
                                            startAngle={90}
                                            // The end angle is calculated to stop at the correct utilization point
                                            endAngle={90 - (stats.used / MAX_ANNUAL_LEAVES) * 360}
                                            stroke="none"
                                            isAnimationActive={false} // Disable animation to keep the look clean
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-blue-600">
                                    {((stats.used / MAX_ANNUAL_LEAVES) * 100).toFixed(0)}%
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold text-gray-800">
                                    You have used <span className="text-blue-600">{stats.used}</span> days out of {MAX_ANNUAL_LEAVES} annual leaves.
                                </p>
                                <p className="text-green-600">
                                    <FiCheckCircle className="inline mr-1" /> Remaining: <span className="font-bold">{stats.remaining}</span> days.
                                </p>
                                <p className="text-gray-500">
                                    Pending Approval: <span className="font-bold text-yellow-600">{stats.pending}</span> days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. LEAVE CHART + 4. HISTORY TABLE (Full Width) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Leave Breakdown Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 font-poppins">
                        <FiPieChart className="text-blue-600" /> Leave Breakdown
                    </h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} days`, name]} />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Leave History Table */}
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 font-poppins">
                        <FiList className="text-green-600" /> Leave History
                    </h2>
                    
                    {/* Filter Bar */}
                    <div className="flex items-center gap-3 mb-4 p-3 border rounded-lg bg-gray-50">
                        <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="p-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="All">All</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <button 
                            onClick={() => setFilterStatus('All')}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors ml-auto"
                        >
                            Clear Filter
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLeaves.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{record.type}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(record.from).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(record.to).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-center">{record.days}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            {getStatusChip(record.status)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => alert(`Viewing details for: ${record.reason}`)}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredLeaves.length === 0 && (
                            <p className="text-center text-gray-500 py-6 italic">No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} leave records found.</p>
                        )}
                    </div>
                </div>
            </div>
        </EmployeeLayout>
    );
};

export default EmployeeLeaves;