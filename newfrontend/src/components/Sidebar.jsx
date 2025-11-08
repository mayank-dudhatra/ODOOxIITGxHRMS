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
  FiDollarSign
} from 'react-icons/fi';

const Sidebar = ({ role, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  const getNavItems = () => {
    // HR Role specific navigation items
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
    // Note: You should update this to handle other roles (Payroll, Employee) 
    // based on the context of the currently logged-in user.
    return [{ title: 'Dashboard', path: '/', icon: FiHome }];
  };

  const navItems = getNavItems();

  return (
    <aside
      // Applies styling for fixed, collapsible sidebar with shadows and custom colors
      className={`bg-card border-r border-border h-screen sticky top-0 transition-smooth z-20 shadow-lg ${
        collapsed ? 'w-16' : 'w-64'
      } hidden sm:block`} 
    >
      <div className="flex flex-col h-full">
        {/* Header/Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <h1 className="text-xl font-bold text-primary transition-smooth">WorkZen</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-accent transition-smooth text-foreground"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              // Uses the custom 'nav-item' and 'nav-item-active' classes defined in src/index.css
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : 'text-foreground/70 hover:bg-accent'}`
              }
              title={collapsed ? item.title : item.title}
            >
              <item.icon className="text-lg flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer/Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onLogout}
            className="nav-item w-full text-destructive hover:bg-destructive/10"
            title={collapsed ? 'Logout' : 'Logout'}
          >
            <FiLogOut className="text-lg flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;