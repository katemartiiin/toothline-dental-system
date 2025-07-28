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

export interface ProfileForm {
  name: string | any;
  email: string | any;
  role: string | any;
  currentPassword: string | any;
  newPassword: string | any;
  confirmPassword: string | any;
}

export const fetchUsersByRole = async (filters: UsersFilters) => {
  const res = await axios.get('/admin/users/role', {
    params: filters
  })
  return res.data;
};
// Get Profile
export const fetchCurrentUser = async () => {
  const res = await axios.get('/admin/users/me');
  return res.data;
}

export const createUser = async (userForm: UserForm) => {
  const res = await axios.post('/admin/users', userForm);
  return res.data;
}

export const updateProfile = async (profileForm: ProfileForm) => {
  const res = await axios.put('/admin/users/me', profileForm);
  return res.data;
}