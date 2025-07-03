import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded hover:bg-teal-100 ${
      isActive ? 'bg-teal-200 font-semibold' : ''
    }`;

  return (
    <aside className="w-64 bg-teal-50 border-r p-4">
      <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/appointments" className={linkClass}>
          Appointments
        </NavLink>
        <NavLink to="/admin/schedules" className={linkClass}>
          Schedules
        </NavLink>
        <NavLink to="/admin/services" className={linkClass}>
          Services
        </NavLink>
        <NavLink to="/admin/patients" className={linkClass}>
          Patients
        </NavLink>
        <NavLink to="/admin/security" className={linkClass}>
          Security
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;