import axios from '../lib/axios';

export interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  entity: string;
  entityId: number | null;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AuditLogFilters {
  action?: string;
  userName?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
}

export const fetchAuditLogs = async (filters: AuditLogFilters) => {
  const res = await axios.get('/admin/audit-logs', {
    params: filters
  });
  return res.data;
};

export const fetchAuditLogById = async (id: number) => {
  const res = await axios.get(`/admin/audit-logs/${id}`);
  return res.data;
};
