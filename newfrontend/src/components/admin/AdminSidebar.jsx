import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiUsers, 
  FiBriefcase, 
  FiClock, 
  FiCalendar, 
  FiDollarSign, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Path is up one level

// --- Helper: Sidebar Link ---
const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    // 'end' ensures this link isn't "active" when child routes are active
    end={to === "/company/dashboard"} 
    style={({ isActive }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.625rem', // p-2.5
      borderRadius: '0.375rem', // rounded-md
      fontWeight: '500', // font-medium
      transition: 'all 200ms',
      textDecoration: 'none',
      color: isActive ? '#FFFFFF' : '#6B7280', // Active white, Inactive gray-500
      backgroundColor: isActive ? '#1F2937' : 'transparent', // Active gray-900, Inactive transparent
      // Add hover styles manually via JavaScript if needed, but basic color classes are enough for visibility
      cursor: 'pointer',
    })}
  >
    <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
    <span>{label}</span>
  </NavLink>
);

// --- Main Sidebar Component ---
const AdminSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const companyName = user?.company?.name || "Workzen";
  const companyInitial = companyName.charAt(0).toUpperCase() || 'W';

  return (
    <aside style={{
      width: '16rem', // w-64
      minHeight: '100vh', 
      backgroundColor: '#FFFFFF', // bg-white
      borderRight: '1px solid #E5E7EB', // border-gray-200
      padding: '1rem', // p-4
      display: 'flex', 
      flexDirection: 'column',
    }}>
      {/* 1. Company Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', marginBottom: '1rem' }}>
        <div style={{
          width: '2.5rem', height: '2.5rem', 
          backgroundColor: '#3B82F6', // bg-blue-500
          color: '#FFFFFF', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          borderRadius: '0.5rem', // rounded-lg
          fontWeight: '700', // font-bold
          fontSize: '1.25rem', // text-xl
        }}>
          {companyInitial}
        </div>
        <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' }}>{companyName}</span>
      </div>

      {/* 2. Navigation Links */}
      <nav style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SidebarLink to="/company/dashboard" icon={FiGrid} label="Dashboard" />
        <SidebarLink to="/company/dashboard/employees" icon={FiUsers} label="Employee Management" />
        <SidebarLink to="/company/dashboard/hr" icon={FiBriefcase} label="HR Management" />
        <SidebarLink to="/company/dashboard/attendance" icon={FiClock} label="Attendance" />
        <SidebarLink to="/company/dashboard/leaves" icon={FiCalendar} label="Leave Management" />
        <SidebarLink to="/company/dashboard/payroll" icon={FiDollarSign} label="Payroll Management" />
        <SidebarLink to="/company/dashboard/settings" icon={FiSettings} label="Settings" />
      </nav>

      {/* 3. Logout Button */}
      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', 
            borderRadius: '0.375rem', fontWeight: '500', transition: 'all 200ms', 
            color: '#6B7280', // text-gray-500
            backgroundColor: 'transparent',
            width: '100%',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <FiLogOut style={{ width: '1.25rem', height: '1.25rem' }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;