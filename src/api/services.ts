import axios from '../lib/axios';

export const fetchServices = async () => {
  const res = await axios.get('/admin/services');
  return res.data.data;
};