import axios from '../lib/axios';

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
  const res = await axios.post('/admin/services', serviceForm)
  return res.data;
}

export const deleteService = async (serviceId: number) => {
  const res = await axios.delete('/admin/services/' + serviceId + '/delete');
  return res.data;
}