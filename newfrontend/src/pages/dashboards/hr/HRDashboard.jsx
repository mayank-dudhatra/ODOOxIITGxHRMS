import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiClock, 
  FiCalendar, 
  FiFileText, 
  FiChevronRight,
  FiUser,
  FiArrowUpRight,
  FiArrowDownRight
} from 'react-icons/fi';
import Navbar from '../hr/Navbar';
import Sidebar from '../hr/Sidebar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

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
      className={`bg-white rounded-lg shadow-md p-5 border border-gray-200 flex flex-col justify-between h-full 
                 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
      onClick={() => link && window.location.href(link)}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500 font-medium mb-4">{title}</p>
        <div className={`p-3 rounded-full bg-gray-100 ${colorClass}`}>
          <Icon className="text-lg" />
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
        {trend !== undefined && (
          <p
            className={`text-sm flex items-center ${
              trend >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend >= 0 ? (
              <FiArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <FiArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend)}% trend
          </p>
        )}
      </div>
    </div>
  );
};

const HRDashboard = () => {
  const navigate = useNavigate();
  const [userRole] = useState('HR');

  const stats = [
    { title: "Total Employees", value: "128", icon: FiUsers, colorClass: 'text-blue-500', trend: 3, link: '/hr/employees' },
    { title: "Pending Leave Requests", value: "5", icon: FiCalendar, colorClass: 'text-yellow-500', trend: 2, link: '/hr/leaves' },
    { title: "Attendance Rate Today", value: "92.5%", icon: FiClock, colorClass: 'text-green-500', trend: 0, link: '/hr/attendance' },
    { title: "New Hires (Month)", value: "4", icon: FiUser, colorClass: 'text-sky-500', trend: 15, link: '/hr/employees' },
  ];

  const recentRequests = [
    { id: 1, name: 'John Doe', type: 'Sick Leave', duration: '2 days', status: 'Pending' },
    { id: 2, name: 'Jane Smith', type: 'Casual Leave', duration: '1 day', status: 'Pending' },
    { id: 3, name: 'Mike Johnson', type: 'Annual Leave', duration: '5 days', status: 'Pending' },
    { id: 4, name: 'Sarah Williams', type: 'Sick Leave', duration: '1 day', status: 'Approved' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={userRole} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <Navbar role={userRole} userName="Sarah Connor" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="space-y-10">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">HR Operations Dashboard</h1>
              <p className="text-gray-500 mt-1">Quick access to employee and request management.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <DashboardCard key={i} {...stat} link={stat.link} />
              ))}
            </div>

            {/* Leave Requests & Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leave Requests */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Recent Leave Requests ({recentRequests.filter(r => r.status === 'Pending').length} Pending)
                  </h3>
                  <NavLink
                    to="/hr/leaves"
                    className="text-sm text-blue-500 font-medium flex items-center hover:underline"
                  >
                    View All <FiChevronRight className="w-4 h-4 ml-1" />
                  </NavLink>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-600">
                    <thead>
                      <tr className="border-b border-gray-200 text-left font-semibold text-gray-500">
                        <th className="py-2 px-3">Employee</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3">Duration</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map((request) => (
                        <tr
                          key={request.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-3 font-medium">{request.name}</td>
                          <td className="py-3 px-3">{request.type}</td>
                          <td className="py-3 px-3">{request.duration}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                request.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {request.status === 'Pending' ? (
                              <div className="flex justify-end gap-3">
                                <button className="text-green-600 hover:text-green-500 text-sm font-medium">
                                  Approve
                                </button>
                                <button className="text-red-500 hover:text-red-400 text-sm font-medium">
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Management Quick Links</h3>
                <NavLink
                  to="/hr/employees"
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:bg-gray-50"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
                    <FiUsers className="text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Employee Directory</p>
                    <p className="text-xs text-gray-500">View and update employee profiles.</p>
                  </div>
                  <FiChevronRight className="ml-auto text-gray-400" />
                </NavLink>

                <NavLink
                  to="/hr/attendance"
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:bg-gray-50"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-500">
                    <FiClock className="text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Attendance Records</p>
                    <p className="text-xs text-gray-500">Audit and correct clock-in/out times.</p>
                  </div>
                  <FiChevronRight className="ml-auto text-gray-400" />
                </NavLink>

                <NavLink
                  to="/hr/reports"
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:bg-gray-50"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                    <FiFileText className="text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">View HR Reports</p>
                    <p className="text-xs text-gray-500">Access leave and attendance analytics.</p>
                  </div>
                  <FiChevronRight className="ml-auto text-gray-400" />
                </NavLink>
              </div>
            </div>

            {/* Attendance Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Weekly Attendance Trend</h3>
                <span className="text-sm text-gray-500">Last 7 Working Days</span>
              </div>
              <div className="h-40 bg-gray-50 rounded-lg p-4 flex items-end justify-between space-x-4">
                {[90, 92, 88, 95, 93, 91, 94].map((rate, i) => (
                  <div key={i} className="flex flex-col items-center w-1/7 h-full justify-end">
                    <div
                      className="w-full rounded-t-md bg-blue-400 transition-all"
                      style={{ height: `${rate}%`, minHeight: '10px' }}
                    />
                    <p className="text-xs font-medium text-gray-500 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue'][i]}
                    </p>
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
