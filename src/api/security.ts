import axios from '../lib/axios';
import { toastError, toastSuccess  } from '../utils/toastMessage';

export interface UpdateUserForm {
  role: string;
  resetPassword: boolean;
  locked: boolean;
}

export interface AuditLogData {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export const logCategories: string[] = [
  'APPOINTMENT',
  'SCHEDULE',
  'SERVICE',
  'PATIENT',
  'SECURITY',
  'PROFILE',
];  

export interface AuditLogFilters {
  performedBy: string;
  date: string;
  category: string;
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

export const fetchLatestLogs = async () => {
  const res = await axios.get('/admin/security/audit-logs/latest');
  return res.data;
}

export const fetchLogs = async (filters: AuditLogFilters) => {
  const res = await axios.post('/admin/security/audit-logs', filters);
  return res.data;
}