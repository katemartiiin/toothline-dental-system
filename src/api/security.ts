import axios from '../lib/axios';

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
  const res = await axios.put('/admin/users/' + userId + '/update', updateUserForm);
  return res.data;
};

export const fetchLogs = async () => {
  const res = await axios.get('/admin/security/audit-logs');
  return res.data;
}