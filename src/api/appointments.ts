import axios from '../lib/axios';
import { toastError, toastSuccess } from '../utils/toastMessage';

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
  treatmentPlan: string;
  paidAmount: string | number;
}
export interface UpdateFormData {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceId: string;
  dentistId: string;
  status: string;
  notes: string;
  treatmentPlan: string;
  paidAmount: string | number;
}


export const fetchAppointments = async (filters: AppointmentFilters) => {
  const res = await axios.post('/admin/appointments/fetch', filters);
  return res.data;
};

export const createAppointment = async (formData: FormData) => {
  try {
    const res = await axios.post('/admin/appointments', formData);
    toastSuccess(res.data.message);
    return res.data;
  } catch (error: any) {
    toastError(error.response.data.message);

    if (error.response.data.status == 400) {
      return error.response.data;
    }
  }
};

export const updateAppointment = async (updateFormData: UpdateFormData) => {
  try {
    const res = await axios.put('/admin/appointments/' + updateFormData.id + '/update', updateFormData);
    toastSuccess(res.data.message);
    return res.data;
  } catch (error: any) {
    toastError(error.response.data.message);

    if (error.response.data.status == 400) {
      return error.response.data;
    }
  }
}

export const updateStatus = async (id: number, status: string) => {
  try {
    const res = await axios.patch('/admin/appointments/' + id + '/status', null, 
      {
        params: { status: status }
      })
      toastSuccess(res.data.message);
      return res;

  } catch (error: any) {
    toastError(error.response.data.message);
  }
}

export const toggleArchive = async (id: number, isArchived: boolean) => {
  try {
    const res = await axios.put('/admin/appointments/' + id + '/archive', null, 
    {
      params: { archived: isArchived }
    })
    toastSuccess(res.data.message);
    return res;

  } catch (error: any) {
    toastError(error.response.data.message);
  }
}