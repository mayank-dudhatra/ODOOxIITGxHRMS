import { FiArrowUpRight } from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, colorClass = 'text-blue-600' }) => {
  // Map Tailwind color names to HEX for background and foreground colors
  const colorMap = {
    'text-blue-600': { text: '#2563EB', bg: '#EFF6FF' },
    'text-sky-600': { text: '#0284C7', bg: '#F0F9FF' },
    'text-green-600': { text: '#16A34A', bg: '#F0FFF4' },
    'text-yellow-600': { text: '#CA8A04', bg: '#FFFBEA' },
  };

  const colors = colorMap[colorClass] || { text: '#2563EB', bg: '#EFF6FF' }; // Default to blue

  return (
    <div style={{
      backgroundColor: '#FFFFFF', // bg-white
      borderRadius: '0.75rem', // rounded-xl
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)', // shadow-md
      padding: '1.5rem', // p-6
      border: '1px solid #E5E7EB', // border-gray-200
      transition: 'all 300ms ease-in-out',
      cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '500', marginBottom: '1rem' }}>{title}</p>
        <div style={{
          padding: '0.5rem', // p-2
          borderRadius: '9999px', // rounded-full
          backgroundColor: colors.bg,
          color: colors.text,
        }}>
          <Icon style={{ fontSize: '1.25rem' }} />
        </div>
      </div>
      <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1F2937', marginTop: '1rem' }}>{value}</p>
    </div>
  );
};

export default StatCard;