import { useEffect, useState } from 'react';
import axios from '../../lib/axios';
interface Patient {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}
interface Service {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}
interface Dentist {
  id: number;
  name: string;
  email: string;
}
interface Appointment {
  id: number;
  patient: Patient;
  service: Service;
  dentist: Dentist;
  notes: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}
interface DashboardData {
  appointmentsToday: Appointment[];
  totalPatients: number;
}

const DashboardPage: React.FC = () => {

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get<DashboardData>('/admin/dashboard');
        setDashboard(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full flex flex-wrap px-16 py-2">

      {/* Cards */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
          <div className="w-full md:w-1/2 h-24">
            <h4 className="fw-500 toothline-text">Today's Appointment</h4>
            <p className="text-2xl fw-700 my-2">{dashboard?.appointmentsToday.length}</p>
          </div>
          <div className="w-1/2">
            <span className="float-right">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3eb8c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-days-icon lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            </span>
          </div>
        </div>

        <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
          <div className="w-full md:w-1/2 h-24">
            <h4 className="fw-500 toothline-text">Total Patients</h4>
            <p className="text-2xl fw-700 my-2">{dashboard?.totalPatients}</p>
          </div>
          <div className="w-1/2">
            <span className="float-right">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3eb8c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-users-round-icon lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
            </span>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="w-full flex flex-wrap p-10 bg-white rounded-lg shadow-md my-5">
        <h2 className="fw-600 text-xl mb-5">Today's Appointments</h2>

        {/* Table Headers */}
        <div className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light border-b border-gray-200 text-xs toothline-text">
          <p>PATIENT</p>
          <p>TIME</p>
          <p>SERVICE</p>
          <p>DENTIST</p>
          <p>STATUS</p>
          <p>ACTIONS</p>
        </div>

        {/* Table Rows */}
        {dashboard?.appointmentsToday.length ? (
          dashboard.appointmentsToday.map((appt) => (
            <div
              key={appt.id}
              className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1"
            >
              <p>{appt.patient.name}</p>
              <p>{appt.appointmentTime}</p>
              <p>{appt.service.name}</p>
              <p>{appt.dentist.name}</p>
              <p className="fw-500 toothline-success">{appt.status}</p>
              <p className="fw-500 toothline-text-accent">
                View <span className="toothline-error ml-3">Check-in</span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No appointments today</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
