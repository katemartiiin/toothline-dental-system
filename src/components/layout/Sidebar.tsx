import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo-admin.png';
import { CalendarCheck, CalendarDays, LayoutDashboard, Stethoscope, UsersRound, LogOut, ChevronRight, Shield, } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: string | number;
}

const NavItem = ({ to, icon: Icon, label, badge }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        group relative flex items-center px-4 py-3 rounded-xl
        transition-all duration-200 ease-out
        ${isActive 
          ? 'toothline-primary text-white shadow-md shadow-teal-200' 
          : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
        }
      `}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-300 rounded-r-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: -16 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Icon size={20} className="mr-3" />
          </motion.div>

          {/* Label */}
          <span className="font-medium text-sm flex-1">{label}</span>

          {/* Badge */}
          {badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`
                px-2 py-0.5 text-xs font-bold rounded-full
                ${isActive ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700'}
              `}
            >
              {badge}
            </motion.span>
          )}

          {/* Hover arrow */}
          <ChevronRight 
            size={16} 
            className={`
              ml-2 opacity-0 -translate-x-2 transition-all duration-200
              group-hover:opacity-100 group-hover:translate-x-0
              ${isActive ? 'text-white/70' : 'text-teal-400'}
            `}
          />
        </>
      )}
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed or already logged out:', err);
    } finally {
      logout();
      navigate('/admin/login');
    }
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/appointments', icon: CalendarDays, label: 'Appointments' },
    { to: '/admin/schedules', icon: CalendarCheck, label: 'Schedules' },
    { to: '/admin/services', icon: Stethoscope, label: 'Services' },
    { to: '/admin/patients', icon: UsersRound, label: 'Patients' },
  ];

  return (
    <motion.aside 
      initial={{ x: -264, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed w-64 bg-white border-r border-gray-100 flex flex-col h-screen font-montserrat shadow-sm"
    >
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <motion.img 
          src={logo} 
          alt="Toothline Admin"
          className="w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </p>
        </motion.div>

        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <NavItem {...item} />
          </motion.div>
        ))}

        {/* Admin-only section */}
        {userRole === 'ADMIN' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Administration
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <NavItem 
                to="/admin/security" 
                icon={Shield} 
                label="Security" 
              />
            </motion.div>
          </>
        )}
      </nav>

      {/* User section & Logout */}
      <div className="p-4 border-t border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Role badge */}
          <div className="flex items-center justify-center mb-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-50 text-teal-700">
              {userRole}
            </span>
          </div>

          {/* Logout button */}
          <motion.button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 text-red-500 rounded-xl
                       hover:bg-red-50 transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
            <span className="font-medium text-sm">Log out</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
