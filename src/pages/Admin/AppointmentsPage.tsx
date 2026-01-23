import Modal from '../../components/Modal';
import ErrorText from '../../components/ErrorText';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {  ArrowLeft,  ArrowRight,  Plus,  Calendar,  Clock,  User,  Stethoscope, Search, Pencil, CheckCircle, 
  CalendarCheck, CalendarClock, CalendarX, PlayCircle, Archive, Phone, Mail, DollarSign
} from 'lucide-react';
import { fetchPublicServices } from '../../api/services';
import { type FieldError } from '../../utils/toastMessage';
import { createChangeHandler } from '../../utils/changeHandler'
import {fetchUsersByRole, type UsersFilters } from '../../api/users';
import { type PageOptions, updatePageOptions } from '../../utils/paginate';
import { fetchAppointments, createAppointment, updateAppointment, updateStatus, toggleArchive, 
  type AppointmentFilters, type FormData, type UpdateFormData } from '../../api/appointments';

interface Appointment {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  serviceId: number;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  dentistId: number;
  dentistName: string;
  status: string;
  treatmentPlan: string;
  paidAmount: string | number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

interface Dentist {
  id: number;
  email: string;
  name: string;
  role: string;
}

// Animation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2 }
  }
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    CONFIRMED: { 
      bg: 'bg-green-100', 
      text: 'text-green-700',
      icon: <CalendarCheck size={14} />
    },
    PENDING: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-700',
      icon: <CalendarClock size={14} />
    },
    IN_PROGRESS: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-700',
      icon: <PlayCircle size={14} />
    },
    CANCELLED: { 
      bg: 'bg-red-100', 
      text: 'text-red-700',
      icon: <CalendarX size={14} />
    },
    COMPLETED: { 
      bg: 'bg-teal-100', 
      text: 'text-teal-700',
      icon: <CheckCircle size={14} />
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.icon}
      {status.replace(/_/g, ' ')}
    </span>
  );
};

// Status changes
const ActionButton: React.FC<{ 
  status: string; 
  onStatusChange: () => void;
  onArchive: () => void;
}> = ({ status, onStatusChange, onArchive }) => {
  const isArchivable = status === 'COMPLETED' || status === 'CANCELLED';
  
  const buttonConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    PENDING: { 
      label: 'Confirm', 
      color: 'bg-yellow-500 hover:bg-yellow-600',
      icon: <CheckCircle size={14} />
    },
    CONFIRMED: { 
      label: 'Check-in', 
      color: 'bg-orange-500 hover:bg-orange-600',
      icon: <PlayCircle size={14} />
    },
    IN_PROGRESS: { 
      label: 'Complete', 
      color: 'bg-green-500 hover:bg-green-600',
      icon: <CheckCircle size={14} />
    },
  };

  if (isArchivable) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onArchive}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 
                   text-white text-xs font-medium rounded-lg transition-colors"
      >
        <Archive size={14} />
        Archive
      </motion.button>
    );
  }

  const config = buttonConfig[status];
  if (!config) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onStatusChange}
      className={`inline-flex items-center gap-1 px-3 py-1.5 ${config.color} 
                 text-white text-xs font-medium rounded-lg transition-colors`}
    >
      {config.icon}
      {config.label}
    </motion.button>
  );
};

// Loading
const TableSkeleton = () => (
  <div className="animate-pulse space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="grid grid-cols-7 gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-20 my-auto" />
        <div className="h-4 bg-gray-200 rounded w-16 my-auto" />
        <div className="h-4 bg-gray-200 rounded w-28 my-auto" />
        <div className="h-4 bg-gray-200 rounded w-24 my-auto" />
        <div className="h-6 bg-gray-200 rounded-full w-24 my-auto" />
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-16" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
      </div>
    ))}
  </div>
);

// Form Input
const FormInput: React.FC<{
  label: string;
  type?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}> = ({ label, type = 'text', name, value, onChange, placeholder, icon, required, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
          focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all
          ${icon ? 'pl-10' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />
    </div>
  </div>
);

// Form Select
const FormSelect: React.FC<{
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  required?: boolean;
}> = ({ label, name, value, onChange, options, placeholder, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                 focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all bg-white"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);

  const [formErrors, setFormErrors] = useState<FieldError[]>([]);

  const [userFilters, setUserFilters] = useState<UsersFilters>({
    role: ""
  });

  const [formData, setFormData] = useState<FormData>({
      name: '',
      email: '',
      phoneNumber: '',
      appointmentDate: '',
      appointmentTime: '',
      serviceId: '',
      dentistId: '',
      notes: '',
      treatmentPlan: '',
      paidAmount: ''
  });

  const defaultSelectedAppointment = {
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    appointmentDate: '',
    appointmentTime: '',
    serviceId: '',
    dentistId: '',
    status: '',
    notes: '',
    treatmentPlan: '',
    paidAmount: ''
  }

  const selectedAppointment = useRef(defaultSelectedAppointment);

  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    id: selectedAppointment.current.id,
    appointmentDate: selectedAppointment.current.appointmentDate,
    appointmentTime: selectedAppointment.current.appointmentTime,
    serviceId: selectedAppointment.current.serviceId,
    dentistId: selectedAppointment.current.dentistId,
    status: selectedAppointment.current.status,
    notes: selectedAppointment.current.notes,
    treatmentPlan: selectedAppointment.current.treatmentPlan,
    paidAmount: selectedAppointment.current.paidAmount,
  });

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AppointmentFilters>({
    serviceId: "",
    patientName: "",
    appointmentDate: "",
    page: 0,
    size: 10
  });

  const [pageOptions, setPageOptions] = useState<PageOptions>({
    first: true,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const defaultFormData: FormData = {
    name: '',
    email: '',
    phoneNumber: '',
    appointmentDate: '',
    appointmentTime: '',
    serviceId: '',
    dentistId: '',
    notes: '',
    treatmentPlan: '',
    paidAmount: ''
  };

  const defaultUpdateFormData: UpdateFormData = {
    id: '',
    appointmentDate: '',
    appointmentTime: '',
    serviceId: '',
    dentistId: '',
    status: '',
    notes: '',
    treatmentPlan: '',
    paidAmount: ''
  }

  const statusRef = useRef<string>('PENDING');

  const setAndEditAppt = (appt: any, isOpen: boolean) => {
    setFormErrors([]);
    selectedAppointment.current = appt;
    setUpdateFormData({
      id: appt.id,
      appointmentDate: appt.appointmentDate,
      appointmentTime: appt.appointmentTime,
      serviceId: appt.serviceId,
      dentistId: appt.dentistId,
      status: appt.status,
      notes: appt.notes,
      treatmentPlan: appt.treatmentPlan,
      paidAmount: appt.paidAmount
    })
    setOpenEdit(isOpen);
  };

  const handleFilterChange = createChangeHandler(setFilters);
  const handleFormChange = createChangeHandler(setFormData);
  const handleUpdateFormChange = createChangeHandler(setUpdateFormData);

  const handleChangePage = (type: string) => {
    const newPage = type == 'next' ? filters.page + 1 : filters.page - 1;

    setFilters({
      serviceId: filters.serviceId,
      patientName: filters.patientName,
      appointmentDate: filters.appointmentDate,
      page: newPage,
      size: filters.size
    })
  }

  const getAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetchAppointments(filters);
      setAppointments(res.content);
      updatePageOptions(setPageOptions, res);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  };

  const getServices = async () => {
    try {
      const dataServices = await fetchPublicServices();
      setServices(dataServices);
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  }

  const getDentists = async () => {
    try {
      userFilters.role = "DENTIST";
      const dataDentists = await fetchUsersByRole(userFilters, null);
      setDentists(dataDentists.content);
    } catch (error) {
      console.error('Failed to fetch dentists', error);
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    const createResponse = await createAppointment(formData);

    if (createResponse.status == 400) {
      setFormErrors(createResponse.errors);
    } else {
      setFormData(defaultFormData);
      setOpenCreate(false);
      getAppointments();
    }
  };

  const handleFormUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    const updateResponse = await updateAppointment(updateFormData);
    
    if (updateResponse.status == 400) {
      setFormErrors(updateResponse.errors);
    } else {
      setOpenEdit(false);
      setUpdateFormData(defaultUpdateFormData);
      selectedAppointment.current = defaultSelectedAppointment;
      getAppointments();
    }
  }

  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    if (currentStatus == "CONFIRMED") {
        statusRef.current = "IN_PROGRESS";
      } else if (currentStatus == "PENDING") {
        statusRef.current = "CONFIRMED";
      } else if (currentStatus == "IN_PROGRESS") {
        statusRef.current = "COMPLETED";
      }

      const updateStatusResponse = await updateStatus(id, statusRef.current);
      if (updateStatusResponse?.status == 200) {
        getAppointments();
      }
  }

  const handleToggleArchive = async (id: number) => {
    const archiveResponse = await toggleArchive(id, true);
    if (archiveResponse?.status == 200) {
      getAppointments();
    }
  }

  useEffect(() => {
    getAppointments();
    getServices();
    getDentists();
  }, [filters]);

  // Get initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-full"
    >
      {/* Header Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Add Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 
                       text-white font-semibold rounded-xl shadow-lg shadow-teal-200 
                       hover:shadow-xl hover:shadow-teal-300 transition-all duration-300"
          >
            <Plus size={20} />
            New Appointment
          </motion.button>

          {/* Filters */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="appointmentDate"
                onChange={handleFilterChange}
                value={filters.appointmentDate}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm 
                           focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all"
              />
            </div>

            <div className="relative">
              <Stethoscope size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                name="serviceId"
                onChange={handleFilterChange}
                value={filters.serviceId}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl text-sm appearance-none
                           focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all bg-white"
              >
                <option value="">All Services</option>
                {services?.map((service) => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="patientName"
                onChange={handleFilterChange}
                value={filters.patientName}
                placeholder="Search patient..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-48
                           focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="text-teal-500" size={20} />
              All Appointments
            </h2>
            <span className="px-3 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded-full">
              {pageOptions.totalElements} total
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : (
            <>
              {/* Column Headers */}
              <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div>Patient</div>
                <div>Date</div>
                <div>Time</div>
                <div>Service</div>
                <div>Dentist</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {/* Table Rows */}
              <AnimatePresence mode="wait">
                {appointments?.length ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {appointments.map((appt, index) => (
                      <motion.div
                        key={appt.id}
                        variants={rowVariants}
                        custom={index}
                        className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-50 
                                   hover:bg-gradient-to-r hover:from-teal-50/30 hover:to-transparent
                                   transition-colors group"
                      >
                        {/* Patient */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 
                                          flex items-center justify-center text-white text-sm font-bold
                                          shadow-md">
                            {getInitials(appt.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{appt.name}</p>
                            <p className="text-xs text-gray-400">{appt.email}</p>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          {appt.appointmentDate}
                        </div>

                        {/* Time */}
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock size={14} className="mr-2 text-gray-400" />
                          {appt.appointmentTime}
                        </div>

                        {/* Service */}
                        <div className="flex items-center">
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg">
                            {appt.serviceName}
                          </span>
                        </div>

                        {/* Dentist */}
                        <div className="flex items-center text-sm text-gray-600">
                          {appt.dentistName || (
                            <span className="text-gray-400 italic">Unassigned</span>
                          )}
                        </div>

                        {/* Status */}
                        <div className="flex items-center">
                          <StatusBadge status={appt.status} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setAndEditAppt(appt, true)}
                            className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 
                                       rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </motion.button>
                          
                          <ActionButton 
                            status={appt.status}
                            onStatusChange={() => handleUpdateStatus(appt.id, appt.status)}
                            onArchive={() => handleToggleArchive(appt.id)}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No appointments found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or create a new appointment</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing <span className="font-semibold">{pageOptions.numberOfElements}</span> of{' '}
                <span className="font-semibold">{pageOptions.totalElements}</span> entries
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show</span>
                <select
                  name="size"
                  value={filters.size}
                  onChange={handleFilterChange}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white
                             focus:ring-2 focus:ring-teal-100 focus:border-teal-400"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: pageOptions.first ? 1 : 1.05 }}
                whileTap={{ scale: pageOptions.first ? 1 : 0.95 }}
                onClick={() => handleChangePage('prev')}
                disabled={pageOptions.first}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${pageOptions.first 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
              >
                <ArrowLeft size={16} />
                Previous
              </motion.button>

              {/* Page Numbers */}
              <div className="hidden md:flex items-center gap-1">
                {Array.from({ length: Math.min(5, pageOptions.totalPages) }, (_, i) => {
                  const pageNum = pageOptions.number - 2 + i;
                  if (pageNum < 0 || pageNum >= pageOptions.totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all
                        ${pageNum === pageOptions.number
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: pageOptions.last ? 1 : 1.05 }}
                whileTap={{ scale: pageOptions.last ? 1 : 0.95 }}
                onClick={() => handleChangePage('next')}
                disabled={pageOptions.last}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${pageOptions.last 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
              >
                Next
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Create Appointment Modal */}
      <Modal
        isOpen={openCreate}
        title="Create New Appointment"
        onClose={() => setOpenCreate(false)}
        size="lg"
      >
        <div className="space-y-5">
          {/* Patient Info */}
          <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
            <h3 className="text-sm font-semibold text-teal-800 mb-3 flex items-center gap-2">
              <User size={16} />
              Patient Information
            </h3>
            <div className="space-y-4">
              <FormInput
                label="Patient Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Jane Doe"
                icon={<User size={16} />}
                required
              />
              <ErrorText field="name" errors={formErrors} />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="jane@example.com"
                    icon={<Mail size={16} />}
                    required
                  />
                  <ErrorText field="email" errors={formErrors} />
                </div>
                <div>
                  <FormInput
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    placeholder="+1 234 567 8900"
                    icon={<Phone size={16} />}
                    required
                  />
                  <ErrorText field="phoneNumber" errors={formErrors} />
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar size={16} />
              Appointment Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label="Date"
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleFormChange}
                    icon={<Calendar size={16} />}
                    required
                  />
                  <ErrorText field="appointmentDate" errors={formErrors} />
                </div>
                <div>
                  <FormInput
                    label="Time"
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleFormChange}
                    icon={<Clock size={16} />}
                    required
                  />
                  <ErrorText field="appointmentTime" errors={formErrors} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormSelect
                    label="Service"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleFormChange}
                    placeholder="Select Service"
                    options={services.map(s => ({ value: s.id, label: s.name }))}
                    required
                  />
                  <ErrorText field="serviceId" errors={formErrors} />
                </div>
                <div>
                  <FormSelect
                    label="Dentist"
                    name="dentistId"
                    value={formData.dentistId}
                    onChange={handleFormChange}
                    placeholder="Select Dentist"
                    options={dentists.map(d => ({ value: d.id, label: d.name }))}
                  />
                  <ErrorText field="dentistId" errors={formErrors} />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange as any}
                placeholder="Any special requests or notes..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Treatment Plan
              </label>
              <textarea
                name="treatmentPlan"
                value={formData.treatmentPlan}
                onChange={handleFormChange as any}
                placeholder="Initial treatment plan..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all resize-none"
              />
            </div>

            <FormInput
              label="Paid Amount"
              type="number"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleFormChange}
              placeholder="0.00"
              icon={<DollarSign size={16} />}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setOpenCreate(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl
                         hover:bg-gray-100 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleFormSubmit}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white 
                         font-semibold rounded-xl shadow-lg shadow-teal-200 
                         hover:shadow-xl hover:shadow-teal-300 transition-all"
            >
              Create Appointment
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={openEdit}
        title={`Edit Appointment #${selectedAppointment.current.id}`}
        onClose={() => setOpenEdit(false)}
        size="lg"
      >
        <div className="space-y-5">
          {/* Patient Info (Read-only) */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} />
              Patient Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="font-medium text-gray-800">{selectedAppointment.current.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800">{selectedAppointment.current.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-gray-800">{selectedAppointment.current.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="p-4 bg-teal-50 rounded-xl">
            <h3 className="text-sm font-semibold text-teal-800 mb-3 flex items-center gap-2">
              <Calendar size={16} />
              Appointment Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label="Date"
                    type="date"
                    name="appointmentDate"
                    value={updateFormData.appointmentDate}
                    onChange={handleUpdateFormChange}
                    icon={<Calendar size={16} />}
                  />
                  <ErrorText field="appointmentDate" errors={formErrors} />
                </div>
                <div>
                  <FormInput
                    label="Time"
                    type="time"
                    name="appointmentTime"
                    value={updateFormData.appointmentTime}
                    onChange={handleUpdateFormChange}
                    icon={<Clock size={16} />}
                  />
                  <ErrorText field="appointmentTime" errors={formErrors} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormSelect
                    label="Service"
                    name="serviceId"
                    value={updateFormData.serviceId}
                    onChange={handleUpdateFormChange}
                    placeholder="Select Service"
                    options={services.map(s => ({ value: s.id, label: s.name }))}
                  />
                  <ErrorText field="serviceId" errors={formErrors} />
                </div>
                <div>
                  <FormSelect
                    label="Dentist"
                    name="dentistId"
                    value={updateFormData.dentistId}
                    onChange={handleUpdateFormChange}
                    placeholder="Select Dentist"
                    options={dentists.map(d => ({ value: d.id, label: d.name }))}
                  />
                  <ErrorText field="dentistId" errors={formErrors} />
                </div>
              </div>

              <FormSelect
                label="Status"
                name="status"
                value={updateFormData.status}
                onChange={handleUpdateFormChange}
                options={[
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'CONFIRMED', label: 'Confirmed' },
                  { value: 'IN_PROGRESS', label: 'In Progress' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                  { value: 'COMPLETED', label: 'Completed' },
                ]}
              />
              <ErrorText field="status" errors={formErrors} />
            </div>
          </div>

          {/* Notes & Treatment */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Patient Notes <span className="text-gray-400 text-xs">(Read-only)</span>
              </label>
              <textarea
                name="notes"
                value={updateFormData.notes}
                readOnly
                disabled
                rows={2}
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm
                           cursor-not-allowed resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Treatment Plan
              </label>
              <textarea
                name="treatmentPlan"
                value={updateFormData.treatmentPlan}
                onChange={handleUpdateFormChange as any}
                placeholder="Update treatment plan..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all resize-none"
              />
            </div>

            <FormInput
              label="Paid Amount"
              type="number"
              name="paidAmount"
              value={updateFormData.paidAmount}
              onChange={handleUpdateFormChange}
              placeholder="0.00"
              icon={<DollarSign size={16} />}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setOpenEdit(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl
                         hover:bg-gray-100 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleFormUpdate}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white 
                         font-semibold rounded-xl shadow-lg shadow-teal-200 
                         hover:shadow-xl hover:shadow-teal-300 transition-all"
            >
              Update Appointment
            </motion.button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AppointmentsPage;
