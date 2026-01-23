import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {  Search, FileText, Clock, Activity, Download, Eye } from 'lucide-react';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import { createChangeHandler } from '../../utils/changeHandler';
import { fetchAuditLogs, type AuditLogFilters } from '../../api/auditLogs';
import { type PageOptions, updatePageOptions } from '../../utils/paginate';

interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  userId: number;
  userName: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

const tableRowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const ActionBadge = ({ action }: { action: string }) => {
  const actionConfig: Record<string, string> = {
    CREATE: 'bg-green-100 text-green-700',
    UPDATE: 'bg-blue-100 text-blue-700',
    DELETE: 'bg-red-100 text-red-700',
    LOGIN: 'bg-purple-100 text-purple-700',
    LOGOUT: 'bg-gray-100 text-gray-700',
    VIEW: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${actionConfig[action] || 'bg-gray-100 text-gray-700'}`}>
      <Activity size={12} />
      {action}
    </span>
  );
};

const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [openView, setOpenView] = useState(false);

  const [filters, setFilters] = useState<AuditLogFilters>({
    action: "",
    userName: "",
    page: 0,
    size: 10
  });

  const [pageOptions, setPageOptions] = useState<PageOptions>({
    first: true,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  const handleFilterChange = createChangeHandler(setFilters);

  const handleChangePage = (type: string) => {
    const newPage = type === 'next' ? filters.page + 1 : filters.page - 1;
    setFilters({ ...filters, page: newPage });
  };
  
  const getLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAuditLogs(filters);
      setLogs(res.content);
      updatePageOptions(setPageOptions, res);
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    getLogs();
  }, [filters]);

  const selectClasses = "px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all duration-200";

  return (
    <div className="px-8 py-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Audit Logs</h2>
            <p className="text-sm text-gray-500">Track system activities and changes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              name="userName" 
              value={filters.userName} 
              onChange={handleFilterChange} 
              className="pl-10 pr-4 py-2.5 w-56 text-sm bg-white border border-gray-200 rounded-xl
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all" 
              placeholder="Search by user..." 
            />
          </div>

          {/* Action Filter */}
          <select
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
            className={selectClasses}
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="VIEW">View</option>
          </select>

          {/* Export button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium 
                       rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Download size={18} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: 'Total Logs', value: pageOptions.totalElements, color: 'bg-blue-50 text-blue-600' },
          { label: 'Creates', value: logs.filter(l => l.action === 'CREATE').length, color: 'bg-green-50 text-green-600' },
          { label: 'Updates', value: logs.filter(l => l.action === 'UPDATE').length, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Deletes', value: logs.filter(l => l.action === 'DELETE').length, color: 'bg-red-50 text-red-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`p-4 rounded-xl ${stat.color}`}
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-80">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={`skeleton-${i}`}>
                      <td className="px-6 py-4"><div className="h-4 w-36 bg-gray-100 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-10 bg-gray-100 rounded-lg animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-100 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-16 bg-gray-100 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : logs?.length ? (
                  logs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Clock size={14} className="text-gray-400" />
                          {formatDate(log.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 
                                          flex items-center justify-center text-orange-600 font-semibold text-sm">
                            {log.userName?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <span className="font-medium text-gray-800 text-sm">{log.userName || 'System'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ActionBadge action={log.action} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">
                          {log.entityType} #{log.entityId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-500 text-sm font-mono">
                          {log.ipAddress || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedLog(log);
                            setOpenView(true);
                          }}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye size={16} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FileText size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No audit logs found</p>
                        <p className="text-gray-400 text-sm mt-1">Activity will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <Pagination
          pageOptions={pageOptions}
          filters={filters}
          onFilterChange={handleFilterChange}
          onPageChange={handleChangePage}
        />
      </motion.div>

      {/* View Details Modal */}
      <Modal isOpen={openView} title="Audit Log Details" onClose={() => setOpenView(false)}>
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Timestamp</h4>
                <p className="font-semibold text-gray-800">{formatDate(selectedLog.createdAt)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">User</h4>
                <p className="font-semibold text-gray-800">{selectedLog.userName || 'System'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Action</h4>
                <ActionBadge action={selectedLog.action} />
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Entity</h4>
                <p className="font-semibold text-gray-800">{selectedLog.entityType} #{selectedLog.entityId}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-500 mb-1">IP Address</h4>
              <p className="font-mono text-gray-800">{selectedLog.ipAddress || '-'}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Details</h4>
              <p className="text-gray-800 whitespace-pre-wrap text-sm">
                {selectedLog.details || 'No additional details'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLogPage;
