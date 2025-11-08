import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiClock, 
  FiCalendar, 
  FiAlertCircle, 
  FiFileText, 
  FiChevronRight,
  FiUser,
  FiArrowUpRight,
  FiArrowDownRight,
  FiBarChart2
} from 'react-icons/fi';
// CORRECTED IMPORTS: Navigate up two levels (../..) to reach src/
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
// import { AuthContext } from '../../../context/AuthContext'; // Path adjusted if needed

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

// --- Custom Themed Components ---

const DashboardCard = ({ title, value, icon: Icon, trend, colorClass, link }) => {
  // We need the navigate function to handle clicks without a full page reload
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link); // Use navigate for single-page-app routing
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col justify-between h-full 
                  transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] cursor-pointer`}
      onClick={handleClick} // Use the correct click handler
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500 font-medium mb-4">{title}</p>
        {/* We apply the colorClass directly, assuming it's like 'text-blue-600' */}
        <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-')}/10 ${colorClass}`}>
          <Icon className="text-xl" />
        </div>
      </div>
      
      <div className="mt-auto">
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm flex items-center ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <FiArrowUpRight className="w-4 h-4 mr-1" /> : <FiArrowDownRight className="w-4 h-4 mr-1" />}
              {Math.abs(trend)}% trend
            </p>
          )}
      </div>
    </div>
  );
};

const HRDashboard = () => {
  const navigate = useNavigate();
  // const { user, logout } = useContext(AuthContext); // Uncomment if using AuthContext
  const [userRole] = useState('HR');

  // --- Mock Data (To be replaced by /api/analytics and /api/hr calls) ---
  // Updated colorClass to use standard Tailwind colors
  const stats = [
    { title: "Total Employees", value: "128", icon: FiUsers, colorClass: 'text-blue-600', trend: 3, link: '/hr/employees' },
    { title: "Pending Leave Requests", value: "5", icon: FiCalendar, colorClass: 'text-yellow-500', trend: 2, link: '/hr/leaves' },
    { title: "Attendance Rate Today", value: "92.5%", icon: FiClock, colorClass: 'text-green-600', trend: 0, link: '/hr/attendance' },
    { title: "New Hires (Month)", value: "4", icon: FiUser, colorClass: 'text-sky-500', trend: 15, link: '/hr/employees' },
  ];

  const recentRequests = [
    { id: 1, name: 'John Doe', type: 'Sick Leave', duration: '2 days', status: 'Pending' },
    { id: 2, name: 'Jane Smith', type: 'Casual Leave', duration: '1 day', status: 'Pending' },
    { id: 3, name: 'Mike Johnson', type: 'Annual Leave', duration: '5 days', status: 'Pending' },
    { id: 4, name: 'Sarah Williams', type: 'Sick Leave', duration: '1 day', status: 'Approved' },
  ];

  const handleLogout = () => {
    // logout(); // Uncomment if using AuthContext
    navigate('/login');
  };
  
  return (
    // Replaced bg-background and sm:bg-accent with standard classes
    <div className="flex min-h-screen bg-white sm:bg-gray-50">
      {/* 1. Sidebar */}
      <Sidebar role={userRole} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col">
        {/* 2. Navbar */}
        <Navbar role={userRole} userName="Sarah Connor" />

        {/* 3. Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="space-y-8">
            
            {/* Title Section */}
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">HR Operations Dashboard</h1>
              <p className="text-gray-500 mt-1">Quick access to employee and request management.</p>
            </div>

            {/* Stat Cards Grid (4x1 Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <DashboardCard key={i} {...stat} link={stat.link} />
              ))}
            </div>

            {/* Middle Section: Leave Requests & Management Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Pending Leave Requests (2/3 width) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Recent Leave Requests ({recentRequests.filter(r => r.status === 'Pending').length} Pending)</h3>
                        <NavLink 
                            to="/hr/leaves"
                            className="text-sm text-blue-600 font-medium flex items-center hover:underline"
                        >
                            View All <FiChevronRight className="w-4 h-4 ml-1" />
                        </NavLink>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-500">
                                    <th className="py-2 px-3">Employee</th>
                                    <th className="py-2 px-3">Type</th>
                                    <th className="py-2 px-3">Duration</th>
                                    <th className="py-2 px-3">Status</th>
                                    <th className="py-2 px-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentRequests.map((request) => (
                                    <tr key={request.id} className="border-b border-gray-200/50 hover:bg-gray-50 transition-all">
                                        <td className="py-3 px-3 font-medium text-gray-900">{request.name}</td>
                                        <td className="py-3 px-3 text-gray-500">{request.type}</td>
                                        <td className="py-3 px-3 text-gray-500">{request.duration}</td>
                                        <td className="py-3 px-3">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            {request.status === 'Pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button className="text-green-600 hover:text-green-500 text-sm font-medium p-1 transition-all">Approve</button>
                                                    <button className="text-red-600 hover:text-red-500 text-sm font-medium p-1 transition-all">Reject</button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Management Links (1/3 width) */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Management Quick Links</h3>
                    <NavLink 
                        to="/hr/employees"
                        className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:bg-gray-50/50 hover:shadow-md"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full text-blue-600 bg-blue-100/10">
                            <FiUsers className="text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Employee Directory</p>
                            <p className="text-xs text-gray-500">View and update employee profiles.</p>
                        </div>
                        <FiChevronRight className="ml-auto text-gray-400" />
                    </NavLink>
                    <NavLink 
                        to="/hr/attendance"
                        className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:bg-gray-50/50 hover:shadow-md"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full text-sky-600 bg-sky-100/10">
                            <FiClock className="text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Attendance Records</p>
                            <p className="text-xs text-gray-500">Audit and correct clock-in/out times.</p>
                        </div>
                        <FiChevronRight className="ml-auto text-gray-400" />
                    </NavLink>
                    <NavLink 
                        to="/hr/reports"
                        className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:bg-gray-50/50 hover:shadow-md"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full text-green-600 bg-green-100/10">
                            <FiFileText className="text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">View HR Reports</p>
                            <p className="text-xs text-gray-500">Access leave and attendance analytics.</p>
                        </div>
                        <FiChevronRight className="ml-auto text-gray-400" />
                    </NavLink>
                </div>
            </div>
            
             {/* Simple Attendance Trends Chart (Placeholder) */}
             <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Weekly Attendance Trend</h3>
                    <span className="text-sm text-gray-500">Last 7 Working Days</span>
                </div>
                <div className="h-40 bg-gray-50/50 rounded-lg p-4 flex items-end justify-between space-x-4">
                    {[90, 92, 88, 95, 93, 91, 94].map((rate, i) => (
                        <div key={i} className="flex flex-col items-center w-1/7 h-full justify-end">
                            <div 
                                className="w-full rounded-t-lg bg-blue-500/70 transition-all" 
                                style={{ height: `${rate}%`, minHeight: '10px' }} 
                            />
                            <p className="text-xs font-medium text-gray-900 mt-2">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue'][i]}</p>
                        </div>
                    ))}
                </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;