import React, { useState } from 'react';
import { FiDollarSign, FiSearch, FiRefreshCcw, FiUsers, FiPlayCircle, FiXCircle, FiLoader } from 'react-icons/fi';

// --- 1. DUMMY DATA: Payroll Officers ---
const INITIAL_PAYROLL_OFFICERS = [
    {
        _id: 'p001',
        userId: 'LOIPR0001',
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 'sarah.c@loi.com',
        status: 'Active',
        lastLogin: '2025-11-08',
    },
    {
        _id: 'p002',
        userId: 'LOIPR0002',
        firstName: 'Miles',
        lastName: 'Dyson',
        email: 'miles.d@loi.com',
        status: 'Inactive',
        lastLogin: '2025-08-15',
    },
    {
        _id: 'p003',
        userId: 'LOIPR0003',
        firstName: 'T-800',
        lastName: 'Cyberdyne',
        email: 't800@loi.com',
        status: 'Active',
        lastLogin: '2025-11-09',
    },
];

// --- 2. Payroll Management Component ---
const PayrollManagement = () => {
    // Load initial data from local storage if available, to persist changes like toggled status
    const [officers, setOfficers] = useState(() => {
        const stored = localStorage.getItem('dummy_payroll_officers');
        return stored ? JSON.parse(stored) : INITIAL_PAYROLL_OFFICERS;
    });
    
    const [loading, setLoading] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [currentPayRun, setCurrentPayRun] = useState('November 2025');

    // Filter Logic
    const filteredOfficers = officers.filter(officer => {
        const lowerText = filterText.toLowerCase();
        return officer.userId.toLowerCase().includes(lowerText) ||
               officer.firstName.toLowerCase().includes(lowerText) ||
               officer.lastName.toLowerCase().includes(lowerText);
    });
    
    // --- Local Action Handlers ---

    // Toggle Active/Inactive status
    const handleStatusToggle = (id) => {
        setLoading(true);
        setTimeout(() => {
            const updatedOfficers = officers.map(officer => 
                officer._id === id 
                    ? { ...officer, status: officer.status === 'Active' ? 'Inactive' : 'Active' } 
                    : officer
            );
            localStorage.setItem('dummy_payroll_officers', JSON.stringify(updatedOfficers));
            setOfficers(updatedOfficers);
            setLoading(false);
        }, 300);
    };

    // Simulate Running the Payroll
    const handleRunPayroll = () => {
        if (!window.confirm(`Are you sure you want to finalize and run the payroll for ${currentPayRun}? This action is irreversible.`)) {
            return;
        }

        setLoading(true);
        setTimeout(() => {
            alert(`✅ Payroll for ${currentPayRun} has been successfully initiated by the Admin.`);
            
            // Advance the payroll cycle month for demo purposes
            const nextMonthDate = new Date();
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            setCurrentPayRun(nextMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
            
            setLoading(false);
        }, 1500);
    };

    // --- Render Table Row ---
    const OfficerRow = ({ officer }) => {
        const isActive = officer.status === 'Active';

        return (
            <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-900">{officer.firstName} {officer.lastName}</td>
                <td className="py-3 px-3 text-sm text-gray-500">{officer.userId}</td>
                <td className="py-3 px-3 text-sm">{officer.email}</td>
                <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {officer.status}
                    </span>
                </td>
                <td className="py-3 px-3 text-sm text-gray-500">{officer.lastLogin}</td>
                <td className="py-3 px-3 text-right">
                    <button 
                        onClick={() => handleStatusToggle(officer._id)} 
                        className={`text-sm font-medium p-1 rounded-md transition-colors ${isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                        disabled={loading}
                    >
                        {isActive ? 'Deactivate' : 'Activate'}
                    </button>
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
                        <FiDollarSign className="text-green-600" /> Payroll Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Administrative oversight for payroll officers and monthly processes.
                    </p>
                </div>
            </div>

            {/* Quick Actions & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Payroll Run Control Card */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiPlayCircle className="text-blue-500" /> Monthly Pay Cycle
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Current period to process: <strong className="text-lg text-blue-600">{currentPayRun}</strong>
                    </p>
                    <button
                        onClick={handleRunPayroll}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? <FiLoader className="animate-spin" /> : <FiPlayCircle />}
                        {loading ? 'Processing Payroll...' : 'Finalize & Run Monthly Payroll'}
                    </button>
                    <p className="text-xs text-red-500 mt-2 text-center">
                        Warning: This action triggers calculation and finalization.
                    </p>
                </div>
                
                {/* Summary Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiUsers className="text-pink-500" /> Officer Stats
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Total Officers: <span className="font-bold text-gray-800">{officers.length}</span></p>
                            <p>Active: <span className="font-bold text-green-600">{officers.filter(o => o.status === 'Active').length}</span></p>
                            <p>Inactive: <span className="font-bold text-red-600">{officers.filter(o => o.status === 'Inactive').length}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payroll Officer Management Table */}
            <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Payroll Officer Accounts ({filteredOfficers.length})
                </h2>

                {/* Filter Section */}
                <div className="flex items-center gap-4 mb-6 p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <FiSearch className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Filter Payroll Officers by Name or ID"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button 
                        onClick={() => setFilterText('')} 
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                        Clear
                    </button>
                </div>
                

                {/* Records Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login ID</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                <th className="py-3 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOfficers.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No payroll officers found.</td></tr>
                            ) : (
                                filteredOfficers.map(officer => (
                                    <OfficerRow key={officer._id} officer={officer} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PayrollManagement;