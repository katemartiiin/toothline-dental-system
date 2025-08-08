import axios from '../lib/axios';
import { type PaginateDefault } from '../utils/paginate';
import { toastError, toastSuccess  } from '../utils/toastMessage';

export interface UsersFilters {
    role?: string;
};
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  locked: boolean;
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

export const fetchUsersByRole = async (filters: UsersFilters, paginate: PaginateDefault | null) => {
  const res = await axios.get('/admin/users/role', {
    params: {
      ...filters,
      ...(paginate || {})
    }
  })
  return res.data;
};
// Get Profile
export const fetchCurrentUser = async () => {
  const res = await axios.get('/admin/users/me');
  return res.data;
}

export const createUser = async (userForm: UserForm) => {
  try {
    const res = await axios.post('/admin/users', userForm);
    toastSuccess(res.data.message);
    return res.data;
  } catch (error: any) {
    toastError(error.response.data.message);

    if (error.response.data.status == 400) {
      return error.response.data;
    }
  }
}

export const updateProfile = async (profileForm: ProfileForm) => {
  try {
    const res = await axios.put('/admin/users/me', profileForm);
    toastSuccess(res.data.message);
    return res.data;
  } catch (error: any) {
    toastError(error.response.data.message);

    if (error.response.data.status == 400) {
      return error.response.data;
    }
  }
}