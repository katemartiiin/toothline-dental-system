import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
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
          <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
          <Route path="schedules" element={<ProtectedRoute><DentistSchedulesPage /></ProtectedRoute>} />
          <Route path="services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
          <Route path="patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
          <Route path="security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;