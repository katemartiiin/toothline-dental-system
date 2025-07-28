import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import ResetPassword from '../../components/security/ResetPassword';
import AuditLogs from '../../components/security/AuditLogs';
import { fetchUsersByRole, type User, type UsersFilters} from '../../api/users';

const SecurityPage: React.FC = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openLock, setOpenLock] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [userFilters, setUserFilters] = useState<UsersFilters>({
    role: ""
  });

  const getUsers = async() => {
    try {
      const res = await fetchUsersByRole(userFilters);
      setUsers(res);
    } catch (error) {
      console.log('Failed to fetch users', error)
    }
  };

  useEffect(() => {
    getUsers();
  }, [userFilters]);
  return (
    <div className="w-full flex flex-wrap px-16 py-2">

      {/* Cards */}
      <div className="w-full grid grid-cols-2 gap-4">
        <ResetPassword users={users} />
        <AuditLogs />
      </div>

      {/* Table */}

      <div className="w-full flex flex-wrap p-10 bg-white rounded-lg shadow-md my-5">
        <div className="w-1/2">
          <h2 className="fw-600 text-xl mb-5">User Role Management</h2>
        </div>
        <div className="w-1/2 text-right">
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 text-sm toothline-accent text-white rounded hover:toothline-primary"
          >
            + Add New User
          </button>
        </div>

        {/* Table Headers */}
        <div className="w-full grid grid-cols-4 gap-2 px-3 py-2 toothline-bg-light border-b border-gray-200 text-xs toothline-text">
          <p>NAME</p>
          <p>EMAIL</p>
          <p>ROLE</p>
          <p>ACTIONS</p>
        </div>

        {/* Table Rows */}
        <div className="w-full grid grid-cols-4 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Dr. Melissa Chen</p>
          <p>melissa.c@toothline.com</p>
          <p className="toothline-success">Dentist</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit Role</button>
            <button type="button" onClick={() => setOpenLock(true)} className="toothline-error fw-500">Lock</button>
          </div>
        </div>


        {/* Create User */}
          <Modal
            isOpen={openCreate}
            title="Create New User"
            onClose={() => setOpenCreate(false)}
            >
              <div>
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Name</label>
                    <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Email</label>
                    <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., janedoe@example.com" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Role</label>
                    <select id="role" name="role" className="mt-1 block w-full rounded-md text-sm">
                        <option value="admin">Admin</option>
                        <option value="dentist">Dentist</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>
              </div>
          </Modal>

          {/* Edit Role */}
          <Modal
            isOpen={openEdit}
            title="Edit User"
            onClose={() => setOpenEdit(false)}
            >
              <div>
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Name</label>
                    <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Email</label>
                    <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., janedoe@example.com" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Role</label>
                    <select id="role" name="role" className="mt-1 block w-full rounded-md text-sm">
                        <option value="admin">Admin</option>
                        <option value="dentist">Dentist</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>
              </div>
          </Modal>

          {/* Lock User */}
          <Modal
            isOpen={openLock}
            title="Lock User"
            onClose={() => setOpenLock(false)}
            >Are you sure you want to lock this user?
          </Modal>

      </div>
    </div>
  );
};

export default SecurityPage;
