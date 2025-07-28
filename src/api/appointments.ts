import axios from '../lib/axios';

export interface AppointmentFilters {
  serviceId?: string;
  patientName?: string;
  appointmentDate?: string;
  page: number;
  size: number;
};
export interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceId: string;
  dentistId: string;
  notes: string;
}
export interface UpdateFormData {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceId: string;
  dentistId: string;
  status: string;
  notes: string;
}

export const fetchAppointments = async (filters: AppointmentFilters) => {
  const res = await axios.post('/admin/appointments/fetch', filters);
  return res.data;
};

export const createAppointment = async (formData: FormData) => {
  const res = await axios.post('/admin/appointments', formData);
  return res.data;
};

export const updateAppointment = async (updateFormData: UpdateFormData) => {
  const res = await axios.put('/admin/appointments/' + updateFormData.id + '/update', updateFormData);
  return res.data;
}

export const updateStatus = async (id: number, status: string) => {
  const res = await axios.patch('/admin/appointments/' + id + '/status', null, 
    {
      params: { status: status }
    })
  return res.data;
}

export const toggleArchive = async (id: number, isArchived: boolean) => {
  const res = await axios.put('/admin/appointments/' + id + '/archive', null, 
    {
      params: { archived: isArchived }
    })
  return res.data;
}