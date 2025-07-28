import axios from '../lib/axios';

export interface UsersFilters {
    role?: string;
};
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UserForm {
  name: string;
  email: string;
  role: string;
}

export const fetchUsersByRole = async (filters: UsersFilters) => {
  const res = await axios.get('/admin/users/role', {
    params: filters
  })
  return res.data;
};

export const createUser = async (userForm: UserForm) => {
  const res = await axios.post('/admin/users', userForm);
  return res.data;
}