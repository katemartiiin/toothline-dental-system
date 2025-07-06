import { NavLink, useNavigate  } from 'react-router-dom';
import axios from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo-admin.png';
import {
  CalendarCheck,
  CalendarDays,
  LayoutDashboard,
  Settings,
  Stethoscope,
  UsersRound,
  LogOut,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex px-4 py-2 rounded hover:toothline-text hover:bg-teal-100 ${
      isActive ? 'toothline-primary font-semibold text-white' : ''
    }`;

  return (
    <aside className="fixed w-64 bg-white border-r p-4 flex flex-col h-screen font-montserrat">
      <img src={logo} className="mb-4" />

      <div className="flex-1 space-y-2 toothline-text">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={20} className="mr-2 my-auto" /> Dashboard
        </NavLink>
        <NavLink to="/admin/appointments" className={linkClass}>
          <CalendarDays size={20} className="mr-2 my-auto" /> Appointments
        </NavLink>
        <NavLink to="/admin/schedules" className={linkClass}>
          <CalendarCheck size={20} className="mr-2 my-auto" /> Schedules
        </NavLink>
        <NavLink to="/admin/services" className={linkClass}>
          <Stethoscope size={20} className="mr-2 my-auto" /> Services
        </NavLink>
        <NavLink to="/admin/patients" className={linkClass}>
          <UsersRound size={20} className="mr-2 my-auto" /> Patients
        </NavLink>
        <NavLink to="/admin/security" className={linkClass}>
          <Settings size={20} className="mr-2 my-auto" /> Security
        </NavLink>
      </div>

      <div className="pt-4 border-t mt-4">
        <button
          onClick={handleLogout}
          className="flex w-full px-4 py-2 text-red-600 rounded hover:bg-red-100"
        >
          <LogOut size={20} className="mr-2 my-auto" /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;