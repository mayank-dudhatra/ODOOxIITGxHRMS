import { FiUsers, FiBriefcase, FiDollarSign, FiCalendar } from 'react-icons/fi';
import StatCard from '../../components/admin/StatCard'; 

const AdminDashboard = () => {
  const stats = [
    { title: "Total Employees", value: "128", icon: FiUsers, colorClass: 'text-blue-600' },
    { title: "Active HR Managers", value: "2", icon: FiBriefcase, colorClass: 'text-sky-600' },
    { title: "Total Payroll Staff", value: "3", icon: FiDollarSign, colorClass: 'text-green-600' },
    { title: "Pending Leaves", value: "5", icon: FiCalendar, colorClass: 'text-yellow-600' },
  ];

  const buttonStyle = {
    backgroundColor: '#1F2937', // bg-gray-900
    color: '#FFFFFF', // text-white
    padding: '0.5rem', // p-2
    borderRadius: '0.375rem', // rounded-md
    transition: 'all 150ms',
    border: 'none',
    cursor: 'pointer'
  };

  const secondaryButtonStyle = {
    backgroundColor: '#E5E7EB', // bg-gray-200
    color: '#1F2937', // text-gray-800
    padding: '0.5rem',
    borderRadius: '0.375rem',
    transition: 'all 150ms',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}> {/* space-y-8 */}
      {/* 1. Title Section */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#1F2937' }}>
          🏢 Company Admin Dashboard
        </h1>
        <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
          Welcome Admin! Manage all your resources from one place.
        </p>
      </div>

      {/* 2. Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1.5rem' }}> {/* grid-cols-4 gap-6 */}
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* 3. Other Dashboard Widgets (Placeholder) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}> {/* grid-cols-3 gap-6 */}
        
        <div style={{ gridColumn: 'span 2 / span 2', backgroundColor: '#FFFFFF', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>Employee Growth (Placeholder)</h3>
          <div style={{ height: '16rem', backgroundColor: '#F3F4F6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <p style={{ color: '#6B7280' }}>Chart component will go here</p>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button style={buttonStyle}>
              Create New Employee
            </button>
            <button style={secondaryButtonStyle}>
              Run Payroll
            </button>
            <button style={secondaryButtonStyle}>
              Approve Leaves
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;