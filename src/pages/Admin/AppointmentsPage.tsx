import { useRef, useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { fetchAppointments, createAppointment, updateAppointment, updateStatus, toggleArchive, 
  type AppointmentFilters, type FormData, type UpdateFormData } from '../../api/appointments';
import { fetchServices, type ServiceFilters } from '../../api/services';
import {fetchUsersByRole, type UsersFilters } from '../../api/users';
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

  const [userFilters, setUserFilters] = useState<UsersFilters>({
    role: ""
  });

  const [serviceFilters, setServiceFilters] = useState<ServiceFilters>({
    name: ""
  });

  const [formData, setFormData] = useState<FormData>({
      name: '',
      email: '',
      phoneNumber: '',
      appointmentDate: '',
      appointmentTime: '',
      serviceId: '',
      dentistId: '',
      notes: ''
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
    notes: ''
  }

  const selectedAppointment = useRef(defaultSelectedAppointment);

  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    id: selectedAppointment.current.id,
    appointmentDate: selectedAppointment.current.appointmentDate,
    appointmentTime: selectedAppointment.current.appointmentTime,
    serviceId: selectedAppointment.current.serviceId,
    dentistId: selectedAppointment.current.dentistId,
    status: selectedAppointment.current.status,
    notes: selectedAppointment.current.notes
  });

  const [loading, setLoading] = useState(false);
    // const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<AppointmentFilters>({
    serviceId: "",
    patientName: "",
    appointmentDate: "",
    page: 0,
    size: 10
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
    notes: ''
  };

  const defaultUpdateFormData: UpdateFormData = {
    id: '',
    appointmentDate: '',
    appointmentTime: '',
    serviceId: '',
    dentistId: '',
    status: '',
    notes: ''
  }

  const statusRef = useRef<string>('PENDING');

  const setAndEditAppt = (appt: any, isOpen: boolean) => {
    selectedAppointment.current = appt;
    setUpdateFormData({
      id: appt.id,
      appointmentDate: appt.appointmentDate,
      appointmentTime: appt.appointmentTime,
      serviceId: appt.serviceId,
      dentistId: appt.dentistId,
      status: appt.status,
      notes: appt.notes
    })
    setOpenEdit(isOpen);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement >) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement >) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAppointments = async () => {
    try {
      setLoading(true);
      const data = await fetchAppointments(filters);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  };

  const getServices = async () => {
    try {
      const dataServices = await fetchServices(serviceFilters);
      setServices(dataServices);
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  }

  const getDentists = async () => {
    try {
      userFilters.role = "DENTIST";
      const dataDentists = await fetchUsersByRole(userFilters);
      setDentists(dataDentists);
    } catch (error) {
      console.error('Failed to fetch dentists', error);
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createAppointment(formData);
      console.log('Success:', response.data);
      setFormData(defaultFormData);
      getAppointments();
    } catch (err: any) {
        console.error('Form submission error:', err);
    }
  };

  const handleFormUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateResponse = await updateAppointment(updateFormData);
      setOpenEdit(false);
      setUpdateFormData(defaultUpdateFormData);
      selectedAppointment.current = defaultSelectedAppointment;
      getAppointments();
    } catch (err: any) {
      console.error('Form submission error: ', err);
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
      console.log("update status");
      try {
        const updateStatusResponse = await updateStatus(id, statusRef.current);
        getAppointments();
      } catch (err: any) {
        console.error('Status update error: ', err)
      }
  }

  const handleToggleArchive = async (id: number) => {
    console.log("archive");
    try {
      const archiveResponse = await toggleArchive(id, true);
      getAppointments();
    } catch (err: any) {
      console.error('Archive error: ', err)
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
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Email *</label>
                  <input type="text" id="email" name="email" value={formData.email} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Phone Number *</label>
                  <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Date *</label>
                  <input type="date" id="appointmentDate" name="appointmentDate" value={formData.appointmentDate} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">Time *</label>
                  <input type="time" id="appointmentTime" name="appointmentTime" value={formData.appointmentTime} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" />
                </div>
              </div>
              <div className="mb-4">
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
              </div>
              <div className="mb-4">
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
              </div>
              <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Additional Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="Type here..." />
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
                  <label className="block text-sm fw-500 toothline-text">Patient Info</label>
                  <input type="text" id="patientName" name="patientName" value={selectedAppointment.current.name} className="mt-1 block w-full rounded-md text-sm" readOnly />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Date</label>
                  <input type="date" id="appointmentDate" name="appointmentDate" value={updateFormData.appointmentDate} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">Time</label>
                  <input type="time" id="appointmentTime" name="appointmentTime" value={updateFormData.appointmentTime} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm" />
                </div>
              </div>
              <div className="mb-4">
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
              </div>
              <div className="mb-4">
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
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Status</label>
                  <select id="status" name="status" value={updateFormData.status} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm">
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                  </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Additional Notes</label>
                <textarea name="notes" value={updateFormData.notes} onChange={handleUpdateFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="Type here..." />
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
        <div className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light border-b border-gray-200 text-xs toothline-text">
          <p>PATIENT</p>
          <p>TIME</p>
          <p>SERVICE</p>
          <p>DENTIST</p>
          <p>STATUS</p>
          <p>ACTIONS</p>
        </div>

        {/* Table Rows */}
        {appointments?.length ? (
          appointments.map((appt) => (
            <div key={appt.id} className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
              <p>{appt.name}</p>
              <p>{appt.appointmentTime}</p>
              <p>{appt.serviceName}</p>
              <p>{appt.dentistName ?? 'Unassigned'}</p>
              <p className={`fw-500 ${(appt.status === 'CONFIRMED' || appt.status === 'COMPLETED') ? 'toothline-success'
                    : appt.status === 'PENDING' ? 'text-yellow-500'
                    : appt.status === 'IN_PROGRESS' ? 'toothline-text-primary'
                    : 'toothline-error' }`}>
                {appt.status}
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
        
      </div>
    </div>
  );
};

export default AppointmentsPage;
