import Modal from '../../components/Modal';
import { useEffect, useState } from 'react';
import ErrorText from '../../components/ErrorText';
import Pagination from '../../components/Pagination';
import { type FieldError } from '../../utils/toastMessage';
import AuditLogs from '../../components/security/AuditLogs';
import { createChangeHandler } from '../../utils/changeHandler';
import ResetPassword from '../../components/security/ResetPassword';
import { updateUserAsAdmin, type UpdateUserForm } from '../../api/security';
import { type PageOptions, type PaginateDefault, updatePageOptions } from '../../utils/paginate';
import { fetchUsersByRole, createUser, type UserForm, type User, type UsersFilters} from '../../api/users';

const SecurityPage: React.FC = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openLock, setOpenLock] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const [userFilters, setUserFilters] = useState<UsersFilters>({
    role: "",
  });

  const [paginateDefault, setPaginateDefault] = useState<PaginateDefault>({
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

  const defaultUserForm = {
    name: '',
    email: '',
    role: 'ADMIN'
  }

  const defaultUserUpdateForm = {
    role: '',
    resetPassword: false,
    locked: false
  }

  const [userForm, setUserForm] = useState<UserForm>(defaultUserForm);

  const [updateUserForm, setUpdateUserForm] = useState<UpdateUserForm>(defaultUserUpdateForm);
  const [user, setUser] = useState<User | any>();

  const handleUserForm = createChangeHandler(setUserForm);
  const handleUpdateUserRole = createChangeHandler(setUpdateUserForm);
  const handleFilterChange = createChangeHandler(setPaginateDefault);

  const getUsers = async() => {
    try {
      const res = await fetchUsersByRole(userFilters, paginateDefault);
      setUsers(res.content);
      updatePageOptions(setPageOptions, res);
    } catch (error) {
      console.log('Failed to fetch users', error)
    }
  };

  const handleUserUpdate = (user: User | any, type: string) => {
    setFormErrors([]);
    setUser(user);

    if (type == 'edit') {
      updateUserForm.role = user.role;
      updateUserForm.locked = false;
      setOpenEdit(true);
    } else {
      updateUserForm.role = '';
      updateUserForm.locked = !user.locked;
      setOpenLock(true);
    }
  };

  const handleChangePage = (type: string) => {
    const newPage = type == 'next' ? paginateDefault.page + 1 : paginateDefault.page - 1;

    setPaginateDefault({
      page: newPage,
      size: paginateDefault.size
    })
  }

  const createNewUser = async () => {
    const createResponse = await createUser(userForm);
    
    if (createResponse.status == 400) {
      setFormErrors(createResponse.errors);
    } else {
      setUserForm(defaultUserForm);
      getUsers();
    }
  };

  const updateUserData = async () => {
    const updateResponse = await updateUserAsAdmin(user.id, updateUserForm);
    
    if (updateResponse?.status == 200) {
      setUpdateUserForm(defaultUserUpdateForm);
      setOpenEdit(false);
      setOpenLock(false);
      getUsers();
    }
  };

  useEffect(() => {
    getUsers();
  }, [userFilters, paginateDefault]);
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
        {users?.length ? (
          users.map((user) => (
          <div key={user.id} className="w-full grid grid-cols-4 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p className="toothline-text-primary">{user.role}</p>
            <div className="space-x-3">
              <button type="button" onClick={() => handleUserUpdate(user, 'edit')} className="toothline-text-accent fw-500">Edit Role</button>
              <button type="button" onClick={() => handleUserUpdate(user, 'lock')} className="toothline-error fw-500">{user.locked ? 'Unlock' : 'Lock'}</button>
            </div>
          </div>
          ))
        ) : (
          <p className="w-full bg-gray-50 my-1 p-1 text-gray-500 italic text-center">No users added yet.</p>
        )}

        <Pagination
          pageOptions={pageOptions}
          filters={paginateDefault}
          onFilterChange={handleFilterChange}
          onPageChange={handleChangePage}
        />

        {/* Create User */}
          <Modal
            isOpen={openCreate}
            title="Create New User"
            onClose={() => setOpenCreate(false)}
            >
              <div>
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Name</label>
                    <input type="text" id="name" name="name" value={userForm.name} onChange={handleUserForm} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                    <ErrorText field="name" errors={formErrors} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Email</label>
                    <input type="email" id="email" name="email" value={userForm.email} onChange={handleUserForm} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., janedoe@example.com" />
                    <ErrorText field="email" errors={formErrors} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Role</label>
                    <select id="role" name="role" value={userForm.role} onChange={handleUserForm} className="mt-1 block w-full rounded-md text-sm">
                        <option value="ADMIN">Admin</option>
                        <option value="DENTIST">Dentist</option>
                        <option value="STAFF">Staff</option>
                    </select>
                    <ErrorText field="role" errors={formErrors} />
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setOpenCreate(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => createNewUser()}
                    className="px-4 py-2 toothline-bg-error text-white rounded hover:bg-red-600"
                  >
                    Save User
                  </button>
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
                <div className="mb-4 flex">
                    <label className="text-sm fw-500 toothline-text">Name</label>
                    <p className="ml-5 text-sm fw-600">{user?.name}</p>
                </div>
                <div className="mb-4 flex">
                    <label className="text-sm fw-500 toothline-text">Email</label>
                    <p className="ml-5 text-sm fw-600">{user?.email}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Role</label>
                    <select id="role" name="role" value={updateUserForm?.role} onChange={handleUpdateUserRole} className="mt-1 block w-full rounded-md text-sm">
                        <option value="ADMIN">Admin</option>
                        <option value="DENTIST">Dentist</option>
                        <option value="STAFF">Staff</option>
                    </select>
                    <ErrorText field="role" errors={formErrors} />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setOpenEdit(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => updateUserData()}
                    className="px-4 py-2 toothline-bg-error text-white rounded hover:bg-red-600"
                  >
                    Update User
                  </button>
                </div>
              </div>
          </Modal>

          {/* Lock User */}
          <Modal
            isOpen={openLock}
            title={user?.locked ? 'Unlock User' : 'Lock User'}
            onClose={() => setOpenLock(false)}
            >Are you sure you want to {user?.locked ? 'unlock' : 'lock'} this user?
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setOpenLock(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => updateUserData()}
                className="px-4 py-2 toothline-bg-error text-white rounded hover:bg-red-600"
              >
                {user?.locked ? 'Unlock' : 'Lock'} User
              </button>
            </div>
          </Modal>

      </div>
    </div>
  );
};

export default SecurityPage;
