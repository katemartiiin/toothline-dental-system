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

export const fetchAppointments = async (filters: AppointmentFilters) => {
  const res = await axios.post('/admin/appointments/fetch', filters);
  return res.data;
};

export const createAppointment = async (formData: FormData) => {
  const res = await axios.post('/admin/appointments', formData)
  return res.data;
}