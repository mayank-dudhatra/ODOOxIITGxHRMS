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
  return (
    <div 
      className={`bg-card rounded-xl shadow-md p-6 border border-border flex flex-col justify-between h-full 
                 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] cursor-pointer card-hover`}
      onClick={() => link && window.location.href(link)}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground font-medium mb-4">{title}</p>
        <div className={`p-3 rounded-full ${colorClass}/10 ${colorClass}`}>
          <Icon className="text-xl" />
        </div>
      </div>
      
      <div className="mt-auto">
          <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm flex items-center ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
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
  const stats = [
    { title: "Total Employees", value: "128", icon: FiUsers, colorClass: 'text-primary', trend: 3, link: '/hr/employees' },
    { title: "Pending Leave Requests", value: "5", icon: FiCalendar, colorClass: 'text-warning', trend: 2, link: '/hr/leaves' },
    { title: "Attendance Rate Today", value: "92.5%", icon: FiClock, colorClass: 'text-success', trend: 0, link: '/hr/attendance' },
    { title: "New Hires (Month)", value: "4", icon: FiUser, colorClass: 'text-info', trend: 15, link: '/hr/employees' },
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
    <div className="flex min-h-screen bg-background sm:bg-accent">
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
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">HR Operations Dashboard</h1>
              <p className="text-muted-foreground mt-1">Quick access to employee and request management.</p>
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
                <div className="lg:col-span-2 bg-card rounded-xl shadow-md p-6 border border-border">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-foreground">Recent Leave Requests ({recentRequests.filter(r => r.status === 'Pending').length} Pending)</h3>
                        <NavLink 
                            to="/hr/leaves"
                            className="text-sm text-primary font-medium flex items-center hover:underline transition-smooth"
                        >
                            View All <FiChevronRight className="w-4 h-4 ml-1" />
                        </NavLink>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                          <thead>
                              <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                                  <th className="py-2 px-3">Employee</th>
                                  <th className="py-2 px-3">Type</th>
                                  <th className="py-2 px-3">Duration</th>
                                  <th className="py-2 px-3">Status</th>
                                  <th className="py-2 px-3 text-right">Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {recentRequests.map((request) => (
                                  <tr key={request.id} className="border-b border-border/50 hover:bg-accent transition-smooth">
                                      <td className="py-3 px-3 font-medium text-foreground">{request.name}</td>
                                      <td className="py-3 px-3 text-muted-foreground">{request.type}</td>
                                      <td className="py-3 px-3 text-muted-foreground">{request.duration}</td>
                                      <td className="py-3 px-3">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            request.status === 'Pending' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                                        }`}>
                                            {request.status}
                                        </span>
                                      </td>
                                      <td className="py-3 px-3 text-right">
                                        {request.status === 'Pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <button className="text-success hover:text-success/80 text-sm font-medium p-1 transition-smooth">Approve</button>
                                                <button className="text-destructive hover:text-destructive/80 text-sm font-medium p-1 transition-smooth">Reject</button>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
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
                    <h3 className="text-xl font-semibold text-foreground">Management Quick Links</h3>
                    <NavLink 
                        to="/hr/employees"
                        className="p-4 bg-card rounded-lg border border-border shadow-sm flex items-center gap-4 transition-smooth hover:bg-accent/50 hover:shadow-md"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full text-primary bg-primary/10">
                            <FiUsers className="text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Employee Directory</p>
                            <p className="text-xs text-muted-foreground">View and update employee profiles.</p>
                        </div>
                        <FiChevronRight className="ml-auto text-muted-foreground" />
                    </NavLink>
                    <NavLink 
                        to="/hr/attendance"
                        className="p-4 bg-card rounded-lg border border-border shadow-sm flex items-center gap-4 transition-smooth hover:bg-accent/50 hover:shadow-md"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full text-info bg-info/10">
                            <FiClock className="text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Attendance Records</p>
                            <p className="text-xs text-muted-foreground">Audit and correct clock-in/out times.</p>
                        </div>
                        <FiChevronRight className="ml-auto text-muted-foreground" />
                    </NavLink>
                    <NavLink 
                        to="/hr/reports"
                        className="p-4 bg-card rounded-lg border border-border shadow-sm flex items-center gap-4 transition-smooth hover:bg-accent/50 hover:shadow-md"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full text-success bg-success/10">
                            <FiFileText className="text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">View HR Reports</p>
                            <p className="text-xs text-muted-foreground">Access leave and attendance analytics.</p>
                        </div>
                        <FiChevronRight className="ml-auto text-muted-foreground" />
                    </NavLink>
                </div>
            </div>
            
             {/* Simple Attendance Trends Chart (Placeholder) */}
             <div className="bg-card rounded-xl shadow-md p-6 border border-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Weekly Attendance Trend</h3>
                    <span className="text-sm text-muted-foreground">Last 7 Working Days</span>
                </div>
                <div className="h-40 bg-accent/50 rounded-lg p-4 flex items-end justify-between space-x-4">
                    {[90, 92, 88, 95, 93, 91, 94].map((rate, i) => (
                        <div key={i} className="flex flex-col items-center w-1/7 h-full justify-end">
                            <div 
                                className="w-full rounded-t-lg bg-primary/70 transition-smooth" 
                                style={{ height: `${rate}%`, minHeight: '10px' }} 
                            />
                            <p className="text-xs font-medium text-foreground mt-2">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue'][i]}</p>
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