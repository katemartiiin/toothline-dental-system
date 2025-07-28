import axios from '../lib/axios';

export interface UpdateUserForm {
  role: string;
  resetPassword: boolean
}

export const updateUserAsAdmin = async (userId: number, updateUserForm: UpdateUserForm) => {
  const res = await axios.put('/admin/users/' + userId + '/update', updateUserForm);
  return res.data;
};