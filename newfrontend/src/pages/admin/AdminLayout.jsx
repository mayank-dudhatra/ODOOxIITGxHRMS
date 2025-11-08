import { Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
// FIX: Change the import path to correctly point to the Navbar component
import Navbar from '../dashboards/hr/Navbar'; 
import AdminSidebar from '../../components/admin/AdminSidebar'; 

const AdminLayout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const userName = user?.company?.email || "Admin"; 

  // NOTE: Your Navbar component will also need inline styles for full consistency.
  // Assuming it handles its styling internally or via utility classes already.

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}> {/* bg-gray-50 */}
      <AdminSidebar />

      <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        {/* Navbar component here */}
        <Navbar role="Admin" userName={userName} /> 

        <main style={{ flex: '1', padding: '1.5rem' }}> {/* p-6 */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;