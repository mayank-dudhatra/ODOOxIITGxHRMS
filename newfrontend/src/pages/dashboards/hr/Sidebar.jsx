import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiCalendar,
  FiClock,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiFileText,
  FiSettings,
} from 'react-icons/fi';

const Sidebar = ({ role, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  const getNavItems = () => {
    if (role === 'HR') {
      return [
        { title: 'Dashboard', path: '/hr/dashboard', icon: FiHome },
        { title: 'Employees', path: '/hr/employees', icon: FiUsers },
        { title: 'Attendance', path: '/hr/attendance', icon: FiClock },
        { title: 'Leave Requests', path: '/hr/leaves', icon: FiCalendar },
        { title: 'Reports', path: '/hr/reports', icon: FiFileText },
        { title: 'Settings', path: '/hr/settings', icon: FiSettings },
      ];
    }
    return [{ title: 'Dashboard', path: '/', icon: FiHome }];
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ease-in-out z-20 ${
        collapsed ? 'w-16' : 'w-64'
      } hidden sm:flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
            WorkZen
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? (
            <FiChevronRight className="w-5 h-5" />
          ) : (
            <FiChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`
            }
            title={item.title}
          >
            <item.icon className="text-lg flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
          title="Logout"
        >
          <FiLogOut className="text-lg flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
