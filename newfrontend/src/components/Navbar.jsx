import { FiBell, FiUser } from 'react-icons/fi';

const Navbar = ({ role = "HR", userName = "Sarah Connor" }) => {
  const getRoleBadgeColor = () => {
    // Mapping roles to colors for badges based on the new palette
    const colors = {
      admin: 'bg-destructive/10 text-destructive',
      hr: 'bg-primary/10 text-primary',
      payroll: 'bg-warning/10 text-warning',
      employee: 'bg-success/10 text-success',
    };
    return colors[role.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">WorkZen HRMS</h2>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Welcome, {userName}!
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-accent transition-smooth">
            <FiBell className="text-xl text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border border-card"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getRoleBadgeColor()}`}
              >
                {role}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
              <FiUser className="text-primary-foreground text-lg" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;