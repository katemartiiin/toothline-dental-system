import { useEffect, useState } from 'react';
import Pagination from '../../components/Pagination';
import { fetchUsersByRole, type UsersFilters } from '../../api/users';
import { type PageOptions, updatePageOptions } from '../../utils/paginate';
import { fetchLogs, type AuditLogFilters, type AuditLogData, logCategories } from '../../api/security';
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}
const AuditLogPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogData[]>([]);
    const [auditLogFilters, setAuditLogFilters] = useState<AuditLogFilters>({
        performedBy: '',
        category: '',
        date: '',
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

    const [users, setUsers] = useState<User[]>([]);
    const [userFilters, setUserFilters] = useState<UsersFilters>({
        role: ""
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement >) => {
        const { name, value } = e.target;
        setAuditLogFilters((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const getUsers = async () => {
        try {
            const getResponse = await fetchUsersByRole(userFilters, null);
            setUsers(getResponse.content);
        } catch (error) {
            console.error('Failed to fetch dentists', error);
        }
    }

    const getLogs = async () => {
        try {
            const res = await fetchLogs(auditLogFilters);
            setLogs(res.content);
            updatePageOptions(setPageOptions, res);
        } catch (error) {
            console.error('Failed to fetch logs', error);
        }
    };

    const handleChangePage = (type: string) => {
      const newPage = type == 'next' ? auditLogFilters.page + 1 : auditLogFilters.page - 1;

      setAuditLogFilters({
        performedBy: auditLogFilters.performedBy,
        category: auditLogFilters.category,
        date: auditLogFilters.date,
        page: newPage,
        size: auditLogFilters.size
      })
    }

    useEffect(() => {
        getUsers();
        getLogs();
    }, [auditLogFilters]);

 return (
    <div className="w-full flex flex-wrap px-16 py-2">
      <div className="w-full flex justify-end gap-4">
        <input type="date" name="date" value={auditLogFilters.date} onChange={handleFilterChange} className="w-48 rounded-md text-sm" />
        <select id="performedBy" name="performedBy" value={auditLogFilters.performedBy} onChange={handleFilterChange} className="w-48 rounded-md text-sm">
            <option value="">Select User</option>
            {users.map((user) => (
            <option key={user.id} value={user.email}>
                {user.name}
            </option>
            ))}
        </select>
        <select id="category" name="category" value={auditLogFilters.category} onChange={handleFilterChange} className="w-48 rounded-md text-sm">
            <option value="">Select Category</option>
            {logCategories.map((category) => (
            <option key={category} value={category}>
                {category}
            </option>
            ))}
        </select>
      </div>
      {/* Table */}
      <div className="w-full flex flex-wrap px-10 py-5 bg-white rounded-lg shadow-md my-5">
        <h2 className="fw-500 mb-5">Overview of all system activity and logs.</h2>

        {/* Table Headers */}
        <div className="w-full grid grid-cols-4 gap-2 px-3 py-2 toothline-bg-light border-b border-gray-200 text-sm toothline-text">
          <p>TIMESTAMP</p>
          <p>ACTION</p>
          <p>DETAILS</p>
          <p>USER</p>
        </div>

        {/* Table Rows */}
        {logs?.length ? (
          logs.map((log) => (
          <div key={log.id} className="w-full grid grid-cols-4 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
            <p>{log.timestamp}</p>
            <p>{log.action}</p>
            <p>{log.details}</p>
            <p>{log.performedBy}</p>
          </div>
          ))
        ) : (
          <p className="w-full bg-gray-50 my-1 p-1 text-gray-500 italic text-center">No logs yet.</p>
        )}

        <Pagination
          pageOptions={pageOptions}
          filters={auditLogFilters}
          onFilterChange={handleFilterChange}
          onPageChange={handleChangePage}
        />

      </div>
    </div>
  );
};

export default AuditLogPage;