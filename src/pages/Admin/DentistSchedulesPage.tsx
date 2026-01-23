import Modal from '../../components/Modal';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Pencil, Trash2, Plus, Calendar, Clock, User, CheckCircle, XCircle, Coffee, AlertTriangle, ChevronDown } from 'lucide-react';
import ErrorText from '../../components/ErrorText';
import { useAuth } from '../../context/AuthContext';
import { type FieldError } from '../../utils/toastMessage';
import { createChangeHandler } from '../../utils/changeHandler';
import { fetchUsersByRole, type UsersFilters } from '../../api/users';
import { fetchSchedules, fetchMySchedules, createSchedule, createMySchedule, updateSchedule, deleteSchedule,
  type DentistSchedule, type ScheduleForm, type UpdateScheduleForm, type ScheduleDay, scheduleDays } from '../../api/schedules';

interface Dentist {
  id: number;
  email: string;
  name: string;
  role: string;
}

type GroupedSchedules = Record<ScheduleDay, DentistSchedule[]>;

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

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

// Status Badge
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    AVAILABLE: { 
      bg: 'bg-green-100', 
      text: 'text-green-700',
      icon: <CheckCircle size={12} />,
      label: 'Available'
    },
    BREAK: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-700',
      icon: <Coffee size={12} />,
      label: 'Break'
    },
    UNAVAILABLE: { 
      bg: 'bg-red-100', 
      text: 'text-red-700',
      icon: <XCircle size={12} />,
      label: 'Unavailable'
    },
  };

  const config = statusConfig[status] || statusConfig.UNAVAILABLE;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Day Card
const DayCard: React.FC<{
  day: string;
  schedules: DentistSchedule[];
  onEdit: (schedule: DentistSchedule) => void;
  onDelete: (id: number) => void;
  index: number;
}> = ({ day, schedules, onEdit, onDelete, index }) => {
  const dayColors: Record<string, { gradient: string; accent: string }> = {
    MONDAY: { gradient: 'from-blue-500 to-blue-600', accent: 'bg-blue-500' },
    TUESDAY: { gradient: 'from-purple-500 to-purple-600', accent: 'bg-purple-500' },
    WEDNESDAY: { gradient: 'from-teal-500 to-teal-600', accent: 'bg-teal-500' },
    THURSDAY: { gradient: 'from-orange-500 to-orange-600', accent: 'bg-orange-500' },
    FRIDAY: { gradient: 'from-pink-500 to-pink-600', accent: 'bg-pink-500' },
    SATURDAY: { gradient: 'from-cyan-500 to-cyan-600', accent: 'bg-cyan-500' },
    SUNDAY: { gradient: 'from-gray-500 to-gray-600', accent: 'bg-gray-500' },
  };

  const colors = dayColors[day] || dayColors.MONDAY;
  const formattedDay = day.charAt(0) + day.slice(1).toLowerCase();

  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Day Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} px-4 py-3`}>
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <Calendar size={16} />
          {formattedDay}
        </h3>
      </div>

      {/* Schedule Items */}
      <div className="p-3 space-y-2 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {schedules.length > 0 ? (
            schedules.map((schedule, idx) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
              >
                {/* Time */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-sm font-medium">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                  <StatusBadge status={schedule.status} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(schedule)}
                    className="p-1.5 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(schedule.id)}
                    className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center py-6 text-gray-400"
            >
              <Calendar size={24} className="mb-2 opacity-50" />
              <p className="text-xs text-center">No schedule</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Form Input
const FormInput: React.FC<{
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}> = ({ label, type = 'text', name, value, onChange, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
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
        className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                   focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all
                   ${icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

// Form Select
const FormSelect: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ label, name, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
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

const DentistSchedulesPage: React.FC = () => {
  const { userName, userRole } = useAuth();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);

  const defaultScheduleForm = {
    dentistId: '',
    schedDay: null,
    startTime: '',
    endTime: '',
    status: 'AVAILABLE',
  }

  const defaultUpdateSchedForm = {
    id: '',
    schedDay: '',
    startTime: '',
    endTime: '',
    status: 'AVAILABLE',
  }

  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>(defaultScheduleForm);
  const [updateSchedForm, setUpdateScheduleForm] = useState<UpdateScheduleForm>(defaultUpdateSchedForm);

  const [schedules, setSchedules] = useState<GroupedSchedules | null>(null);

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [userFilters, setUserFilters] = useState<UsersFilters>({
    role: ""
  });
  const [selectedDentist, setSelectedDentist] = useState<Dentist | any>({
    id: 0,
    email: '',
    name: '',
    role: ''
  });

  const selectedSchedId = useRef(null)
  const selectedSchedule = useRef(defaultUpdateSchedForm);

  const setAndEditSched = (sched: any, isOpen: boolean) => {
    setFormErrors([]);
    selectedSchedule.current = sched;
    setUpdateScheduleForm({
      id: sched.id,
      schedDay: sched.schedDay,
      startTime: sched.startTime,
      endTime: sched.endTime,
      status: sched.status
    })
    setOpenEdit(isOpen);
  }

  const fetchDentistSchedules = async (dentistId: number | null) => {
    try {
      const res = userRole == 'DENTIST' ? await fetchMySchedules() : await fetchSchedules(dentistId);
      setSchedules(res);
    } catch (err) {
      console.error('Failed to fetch dentist schedule: ' + err);
    }
  };

  const handleScheduleFormChange = createChangeHandler(setScheduleForm);
  const handleUpdateSchedFormChange = createChangeHandler(setUpdateScheduleForm);

  const handleDentistChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    const dentist = dentists.find(d => d.id === selectedId) || null;
    setSelectedDentist(dentist);
    if (selectedId != 0) {
      fetchDentistSchedules(selectedId);
    } else {
      setSchedules(null);
    }
  };

  const handleDeleteSched = (scheduleId: number | any) => {
    selectedSchedId.current = scheduleId;
    setOpenDelete(true);
  };

  const getDentists = async () => {
    try {
      userFilters.role = "DENTIST";
      const dataDentists = await fetchUsersByRole(userFilters, null);
      setDentists(dataDentists.content);
    } catch (error) {
      console.error('Failed to fetch dentists', error);
    }
  }

  const deleteDentistSched = async () => {
    const deleteResponse = await deleteSchedule(selectedSchedId.current);
    if (deleteResponse?.status == 200) {
      setOpenDelete(false);
      fetchDentistSchedules(selectedDentist?.id);
    }
  };

  const createDentistSched = async () => {
    setFormErrors([]);
    const createResponse = userRole == 'DENTIST' ? await createMySchedule(scheduleForm) : await createSchedule(scheduleForm);
    
    if (createResponse.status == 400) {
      setFormErrors(createResponse.errors);
    } else {
      setScheduleForm(defaultScheduleForm);
      setOpenCreate(false);
      fetchDentistSchedules(selectedDentist?.id);
    }
  }

  const updateDentistSched = async () => {
    setFormErrors([]);
    const updateResponse = await updateSchedule(updateSchedForm);
    
    if (updateResponse.status == 400) {
      setFormErrors(updateResponse.errors);
    } else {
      setUpdateScheduleForm(defaultUpdateSchedForm);
      setOpenEdit(false);
      fetchDentistSchedules(selectedDentist?.id);
    }
  }

  useEffect(() => {
    userRole == 'DENTIST' ? fetchDentistSchedules(null) : getDentists();
  }, []);

  const days: ScheduleDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

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
          {/* Dentist Selector or Name */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            {userRole !== 'DENTIST' ? (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Select Dentist</p>
                  <div className="relative">
                    <select
                      name="dentistId"
                      onChange={handleDentistChange}
                      value={selectedDentist?.id || 0}
                      className="appearance-none bg-transparent text-lg font-bold text-gray-800 
                                 pr-8 focus:outline-none cursor-pointer"
                    >
                      <option value="0">Choose a dentist...</option>
                      {dentists?.map((dentist) => (
                        <option key={dentist.id} value={dentist.id}>
                          {dentist.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 
                                flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  {userName?.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Your Schedule</p>
                  <p className="text-lg font-bold text-gray-800">{userName}</p>
                </div>
              </div>
            )}
          </motion.div>

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
            Add Schedule
          </motion.button>
        </div>
      </motion.div>

      {/* Schedule Grid */}
      {(userRole === 'DENTIST' || selectedDentist?.id > 0) ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {days.map((day, index) => (
            <DayCard
              key={day}
              day={day}
              schedules={schedules?.[day] || []}
              onEdit={(sched) => setAndEditSched(sched, true)}
              onDelete={handleDeleteSched}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Dentist</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Choose a dentist from the dropdown above to view and manage their weekly schedule.
          </p>
        </motion.div>
      )}

      {/* Create Schedule Modal */}
      <Modal
        isOpen={openCreate}
        title="Create New Schedule"
        onClose={() => setOpenCreate(false)}
      >
        <div className="space-y-5">
          {userRole !== 'DENTIST' && (
            <div>
              <FormSelect
                label="Dentist"
                name="dentistId"
                value={scheduleForm.dentistId}
                onChange={handleScheduleFormChange}
                placeholder="Select Dentist"
                options={dentists.map(d => ({ value: String(d.id), label: d.name }))}
              />
              <ErrorText field="dentistId" errors={formErrors} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormSelect
                label="Day"
                name="schedDay"
                value={scheduleForm.schedDay || ''}
                onChange={handleScheduleFormChange}
                placeholder="Select day"
                options={scheduleDays.map(day => ({ 
                  value: day, 
                  label: day.charAt(0) + day.slice(1).toLowerCase() 
                }))}
              />
              <ErrorText field="schedDay" errors={formErrors} />
            </div>
            <div>
              <FormSelect
                label="Status"
                name="status"
                value={scheduleForm.status}
                onChange={handleScheduleFormChange}
                options={[
                  { value: 'AVAILABLE', label: 'Available' },
                  { value: 'BREAK', label: 'Break' },
                  { value: 'UNAVAILABLE', label: 'Unavailable' },
                ]}
              />
              <ErrorText field="status" errors={formErrors} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormInput
                label="Start Time"
                type="time"
                name="startTime"
                value={scheduleForm.startTime}
                onChange={handleScheduleFormChange}
                icon={<Clock size={16} />}
              />
              <ErrorText field="startTime" errors={formErrors} />
            </div>
            <div>
              <FormInput
                label="End Time"
                type="time"
                name="endTime"
                value={scheduleForm.endTime}
                onChange={handleScheduleFormChange}
                icon={<Clock size={16} />}
              />
              <ErrorText field="endTime" errors={formErrors} />
            </div>
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
              onClick={createDentistSched}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white 
                         font-semibold rounded-xl shadow-lg shadow-teal-200 
                         hover:shadow-xl hover:shadow-teal-300 transition-all"
            >
              Save Schedule
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Edit Schedule Modal */}
      <Modal
        isOpen={openEdit}
        title="Edit Schedule"
        onClose={() => setOpenEdit(false)}
      >
        <div className="space-y-5">
          {/* Day Badge */}
          <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-teal-600" />
              <span className="font-semibold text-teal-800">
                {selectedSchedule.current.schedDay?.charAt(0)}{selectedSchedule.current.schedDay?.slice(1).toLowerCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormInput
                label="Start Time"
                type="time"
                name="startTime"
                value={updateSchedForm.startTime}
                onChange={handleUpdateSchedFormChange}
                icon={<Clock size={16} />}
              />
              <ErrorText field="startTime" errors={formErrors} />
            </div>
            <div>
              <FormInput
                label="End Time"
                type="time"
                name="endTime"
                value={updateSchedForm.endTime}
                onChange={handleUpdateSchedFormChange}
                icon={<Clock size={16} />}
              />
              <ErrorText field="endTime" errors={formErrors} />
            </div>
          </div>

          <div>
            <FormSelect
              label="Status"
              name="status"
              value={updateSchedForm.status}
              onChange={handleUpdateSchedFormChange}
              options={[
                { value: 'AVAILABLE', label: 'Available' },
                { value: 'BREAK', label: 'Break' },
                { value: 'UNAVAILABLE', label: 'Unavailable' },
              ]}
            />
            <ErrorText field="status" errors={formErrors} />
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
              onClick={updateDentistSched}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white 
                         font-semibold rounded-xl shadow-lg shadow-teal-200 
                         hover:shadow-xl hover:shadow-teal-300 transition-all"
            >
              Update Schedule
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={openDelete}
        title="Delete Schedule"
        onClose={() => setOpenDelete(false)}
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Are you sure?</h3>
          <p className="text-gray-500 text-sm mb-6">
            This action cannot be undone. The schedule will be permanently deleted.
          </p>

          <div className="flex justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setOpenDelete(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl
                         border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={deleteDentistSched}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white 
                         font-semibold rounded-xl transition-colors"
            >
              Delete Schedule
            </motion.button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default DentistSchedulesPage;
