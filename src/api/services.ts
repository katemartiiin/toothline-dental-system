import axios from '../lib/axios';
import { toastError, toastSuccess } from '../utils/toastMessage';

export interface ServiceFilters {
  name?: string;
};
export interface ServiceForm {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

export const fetchServices = async (filters: ServiceFilters) => {
  const res = await axios.post('/admin/services/fetch', filters);
  return res.data.data;
};

export const createService = async (serviceForm: ServiceForm) => {
  try {
    const res = await axios.post('/admin/services', serviceForm)
    toastSuccess(res.data.message);
    return res.data;
  } catch (error: any) {
    toastError(error.response.data.message);

    if (error.response.data.status == 400) {
      return error.response.data;
    }
  }
}

export const updateService = async (serviceId: number, serviceForm: ServiceForm) => {
  try {
    const res = await axios.put('/admin/services/' + serviceId + '/update', serviceForm);
    toastSuccess(res.data.message);
    return res.data;
  } catch (error: any) {
    toastError(error.response.data.message);

    if (error.response.data.status == 400) {
      return error.response.data;
    }
  }
}

export const deleteService = async (serviceId: number) => {
  try {
    const res = await axios.delete('/admin/services/' + serviceId + '/delete');
    toastSuccess(res.data.message);
    return res;
  } catch (error: any) {
    toastError(error.response.data.message);
  }
}