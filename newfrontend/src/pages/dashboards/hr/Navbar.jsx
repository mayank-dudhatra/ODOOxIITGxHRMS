import { FiBell, FiUser } from 'react-icons/fi';

const Navbar = ({ role = "HR", userName = "Sarah Connor" }) => {
  const getRoleBadgeColor = () => {
    const colors = {
      admin: 'bg-red-100 text-red-600',
      hr: 'bg-blue-100 text-blue-600',
      payroll: 'bg-yellow-100 text-yellow-600',
      employee: 'bg-green-100 text-green-600',
    };
    return colors[role.toLowerCase()] || 'bg-gray-100 text-gray-600';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">WorkZen HRMS</h2>
          <p className="text-sm text-gray-500 hidden sm:block">
            Welcome, {userName}!
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FiBell className="text-lg text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{userName}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getRoleBadgeColor()}`}
              >
                {role}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <FiUser className="text-blue-500 text-lg" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
