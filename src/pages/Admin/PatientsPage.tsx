import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Plus, Search, Edit3, Archive, User, Mail, Phone, Users, Loader2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ErrorText from '../../components/ErrorText';
import Pagination from '../../components/Pagination';
import { type FieldError } from '../../utils/toastMessage';
import { createChangeHandler } from '../../utils/changeHandler';
import {
  fetchPatients,
  createPatient,
  updatePatient,
  archivePatient,
  type PatientForm,
  type PatientFilters
} from '../../api/patients';
import { type PageOptions, updatePageOptions } from '../../utils/paginate';

interface Patient {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

const tableRowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultPatientForm = {
    name: '',
    email: '',
    phoneNumber: ''
  };

  const [patientForm, setPatientForm] = useState<PatientForm>(defaultPatientForm);

  const [patientFilters, setPatientFilters] = useState<PatientFilters>({
    name: '',
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

  const [selectedPatient, setSelectedPatient] = useState<Patient>({
    id: 0,
    name: '',
    email: '',
    phoneNumber: ''
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleFilterChange = createChangeHandler(setPatientFilters);
  const handleFormChange = createChangeHandler(setPatientForm);
  const handleFormUpdate = createChangeHandler(setSelectedPatient);

  const handleSelectedPatient = (patient: Patient, type: string) => {
    setFormErrors([]);
    setSelectedPatient(patient);
    type === 'update' ? setOpenEdit(true) : setOpenDelete(true);
  };

  const handleChangePage = (type: string) => {
    const newPage = type === 'next' ? patientFilters.page + 1 : patientFilters.page - 1;
    setPatientFilters({
      name: patientFilters.name,
      page: newPage,
      size: patientFilters.size
    });
  };

  const getPatients = async () => {
    setIsLoading(true);
    try {
      const res = await fetchPatients(patientFilters);
      setPatients(res.content);
      updatePageOptions(setPageOptions, res);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewPatient = async () => {
    setIsSubmitting(true);
    const createResponse = await createPatient(patientForm);

    if (createResponse?.status === 400) {
      setFormErrors(createResponse.errors);
    } else {
      setPatientForm(defaultPatientForm);
      setOpenCreate(false);
      getPatients();
    }
    setIsSubmitting(false);
  };

  const editPatient = async () => {
    setIsSubmitting(true);
    const updateResponse = await updatePatient(selectedPatient.id, selectedPatient);

    if (updateResponse?.status === 400) {
      setFormErrors(updateResponse.errors);
    } else {
      getPatients();
      setOpenEdit(false);
    }
    setIsSubmitting(false);
  };

  const archivePt = async (isArchive: boolean) => {
    setIsSubmitting(true);
    const archiveResponse = await archivePatient(selectedPatient.id, isArchive);

    if (archiveResponse?.status === 200) {
      getPatients();
      setOpenDelete(false);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    getPatients();
  }, [patientFilters]);

  return (
    <div className="px-8 py-4">
      {/* Header Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between mb-6"
      >
        <motion.button
          onClick={() => {
            setFormErrors([]);
            setPatientForm(defaultPatientForm);
            setOpenCreate(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 toothline-accent text-white rounded-xl 
                     hover:toothline-accent-hover transition-all duration-200 shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          <span className="font-medium">Add New Patient</span>
        </motion.button>

        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="name"
            value={patientFilters.name}
            onChange={handleFilterChange}
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
                       focus:border-teal-300 focus:ring-2 focus:ring-teal-100 outline-none
                       transition-all duration-200 w-64"
            placeholder="Search patients..."
          />
        </div>
      </motion.div>

      {/* Main Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-xl">
              <Users size={20} className="text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Patient Records</h2>
              <p className="text-sm text-gray-500">Manage your patient database</p>
            </div>
          </div>
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
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact No.
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 size={32} className="animate-spin text-teal-500 mx-auto" />
                    <p className="text-gray-500 mt-2">Loading patients...</p>
                  </td>
                </tr>
              ) : patients?.length ? (
                <AnimatePresence mode="popLayout">
                  {patients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 
                                          flex items-center justify-center text-teal-600 font-semibold">
                            {patient.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{patient.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {patient.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          {patient.phoneNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => handleSelectedPatient(patient, 'update')}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit patient"
                          >
                            <Edit3 size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleSelectedPatient(patient, 'archive')}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Archive patient"
                          >
                            <Archive size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No patients found</p>
                      <p className="text-gray-400 text-sm mt-1">Add your first patient to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          pageOptions={pageOptions}
          filters={patientFilters}
          onFilterChange={handleFilterChange}
          onPageChange={handleChangePage}
        />
      </motion.div>

      {/* Create Patient Modal */}
      <Modal isOpen={openCreate} title="Add New Patient" onClose={() => setOpenCreate(false)}>
        <div className="space-y-5">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="mr-2 text-teal-500" />
              Patient Name <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={patientForm.name}
              onChange={handleFormChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                         transition-all duration-200"
              placeholder="e.g., Jane Doe"
            />
            <ErrorText field="name" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="mr-2 text-teal-500" />
              Email <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={patientForm.email}
              onChange={handleFormChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                         transition-all duration-200"
              placeholder="e.g., janedoe@example.com"
            />
            <ErrorText field="email" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="mr-2 text-teal-500" />
              Phone Number <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={patientForm.phoneNumber}
              onChange={handleFormChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                         transition-all duration-200"
              placeholder="e.g., 09123456789"
            />
            <ErrorText field="phoneNumber" errors={formErrors} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <motion.button
              type="button"
              onClick={() => setOpenCreate(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={createNewPatient}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 toothline-accent text-white rounded-xl
                         hover:toothline-accent-hover transition-all duration-200 disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              Save Patient
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal isOpen={openEdit} title="Edit Patient" onClose={() => setOpenEdit(false)}>
        <div className="space-y-5">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="mr-2 text-teal-500" />
              Patient Name <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={selectedPatient.name}
              onChange={handleFormUpdate}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                         transition-all duration-200"
              placeholder="e.g., Jane Doe"
            />
            <ErrorText field="name" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="mr-2 text-teal-500" />
              Email <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={selectedPatient.email}
              onChange={handleFormUpdate}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                         transition-all duration-200"
              placeholder="e.g., janedoe@example.com"
            />
            <ErrorText field="email" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="mr-2 text-teal-500" />
              Phone Number <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={selectedPatient.phoneNumber}
              onChange={handleFormUpdate}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                         transition-all duration-200"
              placeholder="e.g., 09123456789"
            />
            <ErrorText field="phoneNumber" errors={formErrors} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <motion.button
              type="button"
              onClick={() => setOpenEdit(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={editPatient}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 toothline-accent text-white rounded-xl
                         hover:toothline-accent-hover transition-all duration-200 disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Edit3 size={18} />}
              Update Patient
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Archive Patient Modal */}
      <Modal isOpen={openDelete} title="Archive Patient" onClose={() => setOpenDelete(false)} size="sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Archive size={32} className="text-red-500" />
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to archive <span className="font-semibold">{selectedPatient.name}</span>?
            This patient will be moved to the archive.
          </p>

          <div className="flex justify-center gap-3">
            <motion.button
              type="button"
              onClick={() => setOpenDelete(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={() => archivePt(true)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl
                         hover:bg-red-600 transition-all duration-200 disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Archive size={18} />}
              Archive Patient
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PatientsPage;
