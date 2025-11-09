import React, { useState, useMemo } from 'react';
import { FiDollarSign, FiDownload, FiBarChart2, FiPieChart, FiCalendar, FiTrendingUp, FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import EmployeeLayout from '../layouts/EmployeeLayout';

// --- HELPER FUNCTION: Currency Formatting (Mocked) ---
const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount || 0);
};

// --- MOCK DATA ---
const currentMonthSummary = {
    month: "October 2025",
    gross: 52000,
    deductions: 3800,
    net: 48200,
    paidDate: "02 Nov 2025",
    paymentMethod: "Bank Transfer"
};

const salaryGrowth = [
    { month: "May", net: 45000 },
    { month: "Jun", net: 46000 },
    { month: "Jul", net: 47000 },
    { month: "Aug", net: 47500 },
    { month: "Sep", net: 48000 },
    { month: "Oct", net: 48200 },
];

const payrollHistory = [
    { id: 1, month: "June 2025", gross: 50000, deductions: 2000, net: 48000, status: "Paid", payslipId: "PS-0625" },
    { id: 2, month: "July 2025", gross: 51000, deductions: 2500, net: 48500, status: "Paid", payslipId: "PS-0725" },
    { id: 3, month: "August 2025", gross: 52000, deductions: 3800, net: 48200, status: "Paid", payslipId: "PS-0825" },
    { id: 4, month: "September 2025", gross: 52000, deductions: 3800, net: 48200, status: "Paid", payslipId: "PS-0925" },
    { id: 5, month: "October 2025", gross: 52000, deductions: 3800, net: 48200, status: "Paid", payslipId: "PS-1025" },
    { id: 6, month: "November 2025", gross: 52000, deductions: 3800, net: 48200, status: "Pending", payslipId: null },
];

const salaryBreakdown = [
    { name: "Earnings (Gross)", value: currentMonthSummary.gross, fill: "#2563EB" },
    { name: "Deductions (Tax/PF)", value: currentMonthSummary.deductions, fill: "#EF4444" },
];

const COLORS = ["#2563EB", "#EF4444"]; // Blue and Red

// --- COMPONENTS ---

const PayrollSummaryCard = ({ summary }) => (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 lg:col-span-2 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 font-poppins">
                    <FiDollarSign className="text-blue-600" /> Payroll Summary
                </h2>
                <p className="text-sm text-gray-500 mt-1">Details for {summary.month}</p>
            </div>
            <button
                onClick={() => alert(`Downloading Payslip for ${summary.month}...`)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md text-sm"
            >
                <FiDownload /> Download Payslip
            </button>
        </div>
        
        <div className="border-t pt-4 mt-4">
            <p className="text-4xl font-extrabold text-green-600">
                {formatINR(summary.net)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
                Net Pay - Paid on {summary.paidDate} via {summary.paymentMethod}
            </p>
        </div>
    </div>
);

const PayrollMiniCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-shadow hover:shadow-lg flex items-center gap-4">
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
            <Icon className={`text-xl ${colorClass}`} />
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">{title}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{formatINR(value)}</p>
        </div>
    </div>
);

const EmployeePayroll = () => {
    const user = { fullName: "Arjun Divraniya" };
    const [filterYear, setFilterYear] = useState('2025');

    // --- Analytics Calculation (YTD) ---
    const YTDAnalytics = useMemo(() => {
        // Filter history by current year state (mocked as 2025)
        const currentYearHistory = payrollHistory.filter(item => item.month.includes(filterYear));

        const totalGross = currentYearHistory.reduce((sum, item) => sum + item.gross, 0);
        const totalDeductions = currentYearHistory.reduce((sum, item) => sum + item.deductions, 0);
        const totalNet = currentYearHistory.reduce((sum, item) => sum + item.net, 0);

        return { totalGross, totalDeductions, totalNet };
    }, [filterYear]);

    const handlePayslipDownload = (id) => {
        const record = payrollHistory.find(r => r.id === id);
        if (record && record.status === 'Paid') {
            alert(`Initiating download for Payslip ID: ${record.payslipId} (${record.month})`);
        } else {
            alert(`Payslip for ${record.month} is not yet available.`);
        }
    };

    return (
        <EmployeeLayout user={user}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 font-poppins">
                    <FiDollarSign className="text-green-600" /> My Payroll & Compensation
                </h1>
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Filter Year:</label>
                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                    >
                        <option value="2025">2025</option>
                        <option value="2024">2024 (Mock)</option>
                    </select>
                </div>
            </div>

            {/* 1. SALARY OVERVIEW SECTION (TOP ROW) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <PayrollSummaryCard summary={currentMonthSummary} />
                
                {/* Mini Cards for Gross/Deductions/Net */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <PayrollMiniCard 
                        title="Gross Salary" 
                        value={currentMonthSummary.gross} 
                        icon={FiArrowUpCircle} 
                        colorClass="text-blue-600 border-blue-100"
                    />
                    <PayrollMiniCard 
                        title="Deductions" 
                        value={currentMonthSummary.deductions} 
                        icon={FiArrowDownCircle} 
                        colorClass="text-red-600 border-red-100"
                    />
                    <PayrollMiniCard 
                        title="Net Pay" 
                        value={currentMonthSummary.net} 
                        icon={FiDollarSign} 
                        colorClass="text-green-600 border-green-100"
                    />
                </div>
            </div>

            {/* 2. PAYROLL ANALYTICS SECTION (MIDDLE ROW) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 2.1 Salary Growth Chart */}
                <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 font-poppins">
                        <FiBarChart2 className="text-blue-600" /> Salary Growth (Last 6 Months)
                    </h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salaryGrowth} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#4B5563" />
                                <YAxis 
                                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
                                    stroke="#4B5563" 
                                    width={60}
                                />
                                <Tooltip
                                    formatter={(value) => formatINR(value)}
                                    labelFormatter={(label) => `Month: ${label}`}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px' }}
                                />
                                <Bar dataKey="net" fill="#2563EB" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2.2 Salary Breakdown Donut Chart */}
                <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 lg:col-span-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 font-poppins">
                        <FiPieChart className="text-red-600" /> Salary Breakdown
                    </h2>
                    <div className="h-72 flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={salaryBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="name"
                                    labelLine={false}
                                >
                                    {salaryBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => formatINR(value)}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px' }}
                                />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Optional: YTD Analytics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <PayrollMiniCard 
                    title="Total Earned (YTD)" 
                    value={YTDAnalytics.totalGross} 
                    icon={FiTrendingUp} 
                    colorClass="text-green-600 border-green-100"
                />
                <PayrollMiniCard 
                    title="Total Deducted (YTD)" 
                    value={YTDAnalytics.totalDeductions} 
                    icon={FiArrowDownCircle} 
                    colorClass="text-red-600 border-red-100"
                />
                <PayrollMiniCard 
                    title="Net Paid (YTD)" 
                    value={YTDAnalytics.totalNet} 
                    icon={FiDollarSign} 
                    colorClass="text-blue-600 border-blue-100"
                />
            </div>


            {/* 3. PAYROLL HISTORY SECTION (BOTTOM ROW) */}
            <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Payroll History ({filterYear})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payslip</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payrollHistory.filter(item => item.month.includes(filterYear)).map((record) => {
                                const isPaid = record.status === 'Paid';
                                const statusColor = isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';

                                return (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{record.month}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{formatINR(record.gross)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 text-right">{formatINR(record.deductions)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600 text-right">{formatINR(record.net)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handlePayslipDownload(record.id)}
                                                disabled={!isPaid}
                                                className={`text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed`}
                                                title={isPaid ? "Download Payslip" : "Payslip not generated"}
                                            >
                                                <FiDownload className="inline text-lg" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </EmployeeLayout>
    );
};

export default EmployeePayroll;