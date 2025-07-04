import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Web/Index';
import LoginPage from './pages/Admin/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/Admin/DashboardPage';
import AppointmentsPage from './pages/Admin/AppointmentsPage';
import DentistSchedulesPage from './pages/Admin/DentistSchedulesPage';
import ServicesPage from './pages/Admin/ServicesPage';
import PatientsPage from './pages/Admin/PatientsPage';
import SecurityPage from './pages/Admin/SecurityPage';
import UserProfilePage from './pages/Admin/UserProfilePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="schedules" element={<DentistSchedulesPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;