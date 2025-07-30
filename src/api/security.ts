import axios from '../lib/axios';
import { toastError, toastInfo, toastSuccess  } from '../utils/toastMessage';

export interface UpdateUserForm {
  role: string;
  resetPassword: boolean;
  locked: boolean;
}

export interface AuditLogData {
  details: string;
  performedBy: string;
  timestamp: string;
}

export const updateUserAsAdmin = async (userId: number, updateUserForm: UpdateUserForm) => {
  try {
    const res = await axios.put('/admin/users/' + userId + '/update', updateUserForm);
    toastSuccess(res.data.message);
    return res;
  } catch (error: any) {
    toastError(error.response.data.message);
  }
};

export const fetchLogs = async () => {
  const res = await axios.get('/admin/security/audit-logs');
  return res.data;
}