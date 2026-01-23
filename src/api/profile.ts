import axios from '../lib/axios';
import { toastError, toastSuccess } from '../utils/toastMessage';

export interface ProfileForm {
  name: string;
  email: string;
}

export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
}

export const updateProfile = async (profileForm: ProfileForm) => {
  try {
    const res = await axios.put('/admin/users/me/profile', profileForm);
    toastSuccess(res.data.message || 'Profile updated successfully');
    return res.data;
  } catch (error: any) {
    toastError(error.response?.data?.message || 'Failed to update profile');

    if (error.response?.data?.status === 400) {
      return error.response.data;
    }
  }
};

export const changePassword = async (passwordForm: PasswordForm) => {
  try {
    const res = await axios.put('/admin/users/me/password', passwordForm);
    toastSuccess(res.data.message || 'Password changed successfully');
    return res.data;
  } catch (error: any) {
    toastError(error.response?.data?.message || 'Failed to change password');

    if (error.response?.data?.status === 400) {
      return error.response.data;
    }
  }
};
