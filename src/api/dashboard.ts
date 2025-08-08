import axios from '../lib/axios';

export const fetchDashboardData = async () => {
  const response = await axios.get('/admin/dashboard');
  return response.data;
};