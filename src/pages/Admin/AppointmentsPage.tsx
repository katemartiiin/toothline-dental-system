import Modal from '../../components/Modal';
import ErrorText from '../../components/ErrorText';
import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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

  return (
    <div className="w-full flex flex-wrap px-16 py-2">
      <div className="w-full flex flex-wrap">
        <div className="w-1/2 text-sm">
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 toothline-accent text-white rounded hover:toothline-primary"
          >
            + Add New Appointment
          </button>
        </div>

        <div className="w-1/2 grid grid-cols-3 gap-3 text-sm">
          <input type="date" name="appointmentDate" onChange={handleFilterChange} value={filters.appointmentDate} className="rounded-md text-sm" />
          <select id="serviceIdfilter" name="serviceId" onChange={handleFilterChange} value={filters.serviceId} className="rounded-md text-sm">
                <option value="">Select Service</option>
                {services?.length ? (
                  services.map((service) => (
                  <option key={service.id} value={service.id}>
                  {service.name}
                  </option>
                  ))
                ) : (
                  <option value="" disabled>Add a Service</option>
                )}
              
          </select>
          <input type="text" id="patientName" name="patientName" onChange={handleFilterChange} value={filters.patientName} className="rounded-md text-sm" placeholder="e.g., Jane Doe" />
        </div>

        {/* Create Appointment */}
        <Modal
          isOpen={openCreate}
          title="Create New Appointment"
          onClose={() => setOpenCreate(false)}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Patient Name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                  <ErrorText field="name" errors={formErrors} />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Email *</label>
                  <input type="text" id="email" name="email" value={formData.email} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                  <ErrorText field="email" errors={formErrors} />
                </div>
                <div>
                    <label className="block text-sm fw-500 toothline-text">Phone Number *</label>
                    <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                    <ErrorText field="phoneNumber" errors={formErrors} />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Date *</label>
                  <input type="date" id="appointmentDate" name="appointmentDate" value={formData.appointmentDate} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" />
                  <ErrorText field="appointmentDate" errors={formErrors} />
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">Time *</label>
                  <input type="time" id="appointmentTime" name="appointmentTime" value={formData.appointmentTime} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" />
                  <ErrorText field="appointmentTime" errors={formErrors} />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Service *</label>
                  <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select Service</option>
                      {services?.length ? (
                        services.map((service) => (
                        <option key={service.id} value={service.id}>
                        {service.name}
                        </option>
                        ))
                      ) : (
                        <option value="" disabled>Add a Service</option>
                      )}
                  </select>
                  <ErrorText field="serviceId" errors={formErrors} />
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">Dentist</label>
                  <select id="dentistId" name="dentistId" value={formData.dentistId} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select Dentist</option>
                      {dentists?.length ? (
                        dentists.map((dentist) => (
                        <option key={dentist.id} value={dentist.id}>
                        {dentist.name}
                        </option>
                        ))
                      ) : (
                        <option value="" disabled>Add a Dentist</option>
                      )}
                  </select>
                  <ErrorText field="dentistId" errors={formErrors} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Additional Notes (Px)</label>
                <textarea name="notes" value={formData.notes} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="Type here..." />
              </div>
              <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Treatment Plan</label>
                <textarea name="treatmentPlan" value={formData.treatmentPlan} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="Type here..." />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Paid Amount</label>
                  <input type="number" id="paidAmount" name="paidAmount" value={formData.paidAmount} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Create Appointment
                </button>
              </div>
            </div>
        </Modal>

        {/* Edit Appointment */}
        <Modal
          isOpen={openEdit}
          title={`Edit Appointment #` + selectedAppointment.current.id}
          onClose={() => setOpenEdit(false)}
          >
            <div>
              <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Patient Name</label>
                <p>{selectedAppointment.current.name}</p>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Email</label>
                  <p>{selectedAppointment.current.email}</p>
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">Phone Number</label>
                  <p>{selectedAppointment.current.phoneNumber}</p>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Date</label>
                  <input type="date" id="appointmentDate" name="appointmentDate" value={updateFormData.appointmentDate} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm" />
                  <ErrorText field="appointmentDate" errors={formErrors} />
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">Time</label>
                  <input type="time" id="appointmentTime" name="appointmentTime" value={updateFormData.appointmentTime} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm" />
                  <ErrorText field="appointmentTime" errors={formErrors} />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Service</label>
                  <select id="serviceType" name="serviceId" value={updateFormData.serviceId} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select Service</option>
                      {services?.length ? (
                        services.map((service) => (
                        <option key={service.id} value={service.id}>
                        {service.name}
                        </option>
                        ))
                      ) : (
                        <option value="" disabled>Add a Service</option>
                      )}
                  </select>
                  <ErrorText field="serviceId" errors={formErrors} />
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">Dentist</label>
                  <select id="dentist" name="dentistId" value={updateFormData.dentistId} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select Dentist</option>
                      {dentists?.length ? (
                        dentists.map((dentist) => (
                        <option key={dentist.id} value={dentist.id}>
                        {dentist.name}
                        </option>
                        ))
                      ) : (
                        <option value="" disabled>Add a Dentist</option>
                      )}
                  </select>
                  <ErrorText field="dentistId" errors={formErrors} />
                </div>
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Status</label>
                  <select id="status" name="status" value={updateFormData.status} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm">
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                  </select>
                  <ErrorText field="status" errors={formErrors} />
              </div>
              <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Additional Notes (Px)</label>
                <textarea name="notes" value={updateFormData.notes} onChange={handleUpdateFormChange} className="bg-gray-100 mt-1 block w-full rounded-md text-sm" disabled readOnly />
              </div>
              <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Treatment Plan</label>
                <textarea name="treatmentPlan" value={updateFormData.treatmentPlan} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="Type here..." />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Paid Amount</label>
                  <input type="number" id="paidAmount" name="paidAmount" value={updateFormData.paidAmount} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm" />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpenEdit(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormUpdate}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Update Appointment
                </button>
              </div>
            </div>
        </Modal>

      </div>
      {/* Table */}
      <div className="w-full flex flex-wrap px-10 py-5 bg-white rounded-lg shadow-md my-5">
        <h2 className="fw-600 text-xl mb-5">All Appointments</h2>

        {/* Table Headers */}
        <div className="w-full grid grid-cols-7 gap-2 px-3 py-2 toothline-bg-light border-b border-gray-200 text-xs toothline-text">
          <p>PATIENT</p>
          <p>DATE</p>
          <p>TIME</p>
          <p>SERVICE</p>
          <p>DENTIST</p>
          <p>STATUS</p>
          <p>ACTIONS</p>
        </div>

        {/* Table Rows */}
        {appointments?.length ? (
          appointments.map((appt) => (
            <div key={appt.id} className="w-full grid grid-cols-7 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
              <p>{appt.name}</p>
              <p>{appt.appointmentDate}</p>
              <p>{appt.appointmentTime}</p>
              <p>{appt.serviceName}</p>
              <p>{appt.dentistName ?? 'Unassigned'}</p>
              <p className={`fw-500 ${(appt.status === 'CONFIRMED' || appt.status === 'COMPLETED') ? 'toothline-success'
                    : appt.status === 'PENDING' ? 'text-yellow-500'
                    : appt.status === 'IN_PROGRESS' ? 'toothline-text-primary'
                    : 'toothline-error' }`}>
                {appt.status.replace(/_/g, " ")}
              </p>
              <div>
                <button type="button" onClick={() => setAndEditAppt(appt, true)} className="toothline-text-accent fw-500">Edit</button>
                <button type="button" onClick={() => (appt.status === 'COMPLETED' || appt.status === 'CANCELLED') ? handleToggleArchive(appt.id) : handleUpdateStatus(appt.id, appt.status)} className={`ml-3 fw-500 ${appt.status === 'CONFIRMED' ? 'text-orange-500'
                    : appt.status === 'PENDING' ? 'text-yellow-500'
                    : appt.status === 'IN_PROGRESS' ? 'toothline-success'
                    : 'toothline-error' }`}>
                  {appt.status === 'CONFIRMED' ? 'Check-in'
                    : appt.status === 'PENDING' ? 'Confirm'
                    : appt.status === 'IN_PROGRESS' ? 'Complete'
                    : 'Archive'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="w-full bg-gray-50 my-1 p-1 text-gray-500 italic text-center">No appointments yet.</p>
        )}

        {/* Pagination */}
        <div className="w-full flex justify-end toothline-bg-light border border-gray-200 p-3 my-1 text-sm space-x-7">
          <span className="my-auto">{ pageOptions.totalElements } total entries</span>
          <div>
            <span className="my-auto mx-2">Show</span>
            <select id="size" name="size" value={filters.size} onChange={handleFilterChange} className="rounded-md text-sm">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
            </select>
          </div>
          <button type="button" onClick={() => handleChangePage('prev')} disabled={pageOptions.first} className={`flex p-1 ${
                pageOptions.first ? 'text-gray-400' : 'hover:toothline-text-primary'
              }`}>
            <ArrowLeft size={25} className="my-auto" />
            <span className="mx-1 my-auto">Previous</span>
          </button>
          <button type="button" onClick={() => handleChangePage('next')} disabled={pageOptions.last} className={`flex p-1 ${
                pageOptions.last ? 'text-gray-400' : 'hover:toothline-text-primary'
              }`}>
            <span className="mx-1 my-auto">Next</span>
            <ArrowRight size={25} className="my-auto" />
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default AppointmentsPage;
