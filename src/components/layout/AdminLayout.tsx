import { Outlet, useLocation  } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  // Simple dynamic title logic based on pathname
  const pageTitles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard Overview',
    '/admin/appointments': 'Appointments',
    '/admin/schedules': 'Dentist Schedules',
    '/admin/services': 'Dental Services',
    '/admin/patients': 'Patients',
    '/admin/security': 'Security Settings',
    '/admin/profile': 'My Profile',
  };

  const title = pageTitles[location.pathname] || 'Toothline Dental Clinic - Admin System';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex flex-col flex-1">
        <Header title={title} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 bg-gray-50 font-opensans">
          <Outlet /> {/* ← This is where the current page (e.g. Dashboard) is inserted */}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
