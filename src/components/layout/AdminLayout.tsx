import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

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
    '/admin/audit-logs': 'Audit Logs'
  };

  const title = pageTitles[location.pathname] || 'Toothline Dental Clinic - Admin System';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AuthProvider>
        <Sidebar />
      </AuthProvider>

      <div className="ml-64 flex flex-col flex-1">
        <Header title={title} />

        <main className="flex-1 p-6 font-opensans overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastStyle={{
            borderRadius: '12px',
            fontFamily: 'Open Sans, sans-serif',
          }}
        />

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
