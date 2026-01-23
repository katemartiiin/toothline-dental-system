import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  UsersRound, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  UserCheck
} from 'lucide-react';
import { fetchDashboardData } from '../../api/dashboard';

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

// Stat card component
const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  changeType,
  color,
  index 
}: { 
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  color: string;
  index: number;
}) => {
  const colorClasses = {
    teal: {
      bg: 'bg-gradient-to-br from-teal-500 to-teal-600',
      icon: 'bg-white/20',
      light: 'bg-teal-50 text-teal-700'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: 'bg-white/20',
      light: 'bg-blue-50 text-blue-700'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: 'bg-white/20',
      light: 'bg-purple-50 text-purple-700'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      icon: 'bg-white/20',
      light: 'bg-orange-50 text-orange-700'
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.teal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`${colors.bg} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${colors.icon} rounded-xl`}>
            <Icon size={24} />
          </div>
          {change && (
            <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full
                            ${changeType === 'up' ? 'bg-green-400/20 text-green-100' : 
                              changeType === 'down' ? 'bg-red-400/20 text-red-100' : 
                              'bg-white/20'}`}>
              {changeType === 'up' && <ArrowUpRight size={14} className="mr-1" />}
              {changeType === 'down' && <ArrowDownRight size={14} className="mr-1" />}
              {change}
            </div>
          )}
        </div>

        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-white/80 text-sm">{label}</div>
      </div>
    </motion.div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
    CONFIRMED: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    PENDING: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    CANCELLED: { color: 'bg-red-100 text-red-700', icon: XCircle },
    COMPLETED: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const DashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="px-8 py-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const stats = [
    {
      icon: CalendarDays,
      label: "Today's Appointments",
      value: dashboard?.appointmentsToday.length || 0,
      change: '+12%',
      changeType: 'up' as const,
      color: 'teal'
    },
    {
      icon: UsersRound,
      label: 'Total Patients',
      value: dashboard?.totalPatients || 0,
      change: '+8%',
      changeType: 'up' as const,
      color: 'blue'
    },
    {
      icon: TrendingUp,
      label: 'Completed Today',
      value: dashboard?.appointmentsToday.filter(a => a.status === 'COMPLETED').length || 0,
      color: 'purple'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: dashboard?.appointmentsToday.filter(a => a.status === 'PENDING').length || 0,
      color: 'orange'
    },
  ];

  return (
    <div className="px-8 py-4 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} index={index} />
        ))}
      </div>

      {/* Appointments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Today's Appointments</h2>
            <p className="text-sm text-gray-500">Manage and track today's patient visits</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 toothline-accent text-white text-sm font-medium rounded-xl 
                       hover:toothline-accent-hover transition-colors"
          >
            View All
          </motion.button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Dentist
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboard?.appointmentsToday.length ? (
                dashboard.appointmentsToday.map((appt, index) => (
                  <motion.tr
                    key={appt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 
                                        flex items-center justify-center text-teal-600 font-semibold">
                          {appt.patient.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{appt.patient.name}</div>
                          <div className="text-xs text-gray-500">{appt.patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={14} className="text-gray-400" />
                        {appt.appointmentTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{appt.service.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{appt.dentist.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Check-in"
                        >
                          <UserCheck size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="More options"
                        >
                          <MoreVertical size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <CalendarDays size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No appointments today</p>
                      <p className="text-gray-400 text-sm mt-1">Appointments will appear here once scheduled</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { title: 'New Appointment', desc: 'Schedule a new patient visit', color: 'teal' },
          { title: 'Add Patient', desc: 'Register a new patient', color: 'blue' },
          { title: 'View Reports', desc: 'Access analytics & reports', color: 'purple' },
        ].map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 bg-white border border-gray-100 rounded-xl text-left 
                       hover:border-teal-200 hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold text-gray-800 group-hover:toothline-text-accent transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
