import { Outlet, useLocation  } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard Overview',
    '/admin/appointments': 'Appointment Management',
    '/admin/schedules': 'Dentist Schedule Management',
    '/admin/services': 'Dental Service Management',
    '/admin/patients': 'Patient Management',
    '/admin/security': 'Security Settings',
    '/admin/profile': 'My Profile',
  };

  const title = pageTitles[location.pathname] || 'Toothline Dental Clinic - Admin System';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AuthProvider>
        <Sidebar />
      </AuthProvider>

      <div className="ml-64 flex flex-col flex-1">
        <Header title={title} />

        <main className="flex-1 p-4 bg-gray-50 font-opensans">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
