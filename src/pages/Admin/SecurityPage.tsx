import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {  Plus,  Search,  Edit3,  Trash2,  Shield, User, Mail, Lock, Eye, EyeOff, UserCog } from 'lucide-react';
import Modal from '../../components/Modal';
import ErrorText from '../../components/ErrorText';
import Pagination from '../../components/Pagination';
import { type FieldError } from '../../utils/toastMessage';
import { createChangeHandler } from '../../utils/changeHandler';
import { fetchUsers, createUser, updateUser, deleteUser, 
  type UserForm, type UserFilters } from '../../api/users';
import { type PageOptions, updatePageOptions } from '../../utils/paginate';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const tableRowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const RoleBadge = ({ role }: { role: string }) => {
  const roleConfig: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    STAFF: 'bg-blue-100 text-blue-700',
    DENTIST: 'bg-green-100 text-green-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleConfig[role] || 'bg-gray-100 text-gray-700'}`}>
      <UserCog size={12} />
      {role}
    </span>
  );
};

const SecurityPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const defaultForm: UserForm = {
    name: '',
    email: '',
    password: '',
    role: 'STAFF'
  };

  const [userForm, setUserForm] = useState<UserForm>(defaultForm);

  const [filters, setFilters] = useState<UserFilters>({
    name: "",
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

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleFilterChange = createChangeHandler(setFilters);
  const handleFormChange = createChangeHandler(setUserForm);

  const handleChangePage = (type: string) => {
    const newPage = type === 'next' ? filters.page + 1 : filters.page - 1;
    setFilters({ ...filters, page: newPage });
  };
  
  const getUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetchUsers(filters);
      setUsers(res.content);
      updatePageOptions(setPageOptions, res);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewUser = async () => {
    const response = await createUser(userForm);
    if (response.status === 400) {
      setFormErrors(response.errors);
    } else {
      setUserForm(defaultForm);
      setOpenCreate(false);
      getUsers();
    }
  };
  
  const editUser = async () => {
    if (!selectedUser) return;
    const response = await updateUser(selectedUser.id, userForm);
    if (response.status === 400) {
      setFormErrors(response.errors);
    } else {
      getUsers();
      setOpenEdit(false);
    }
  };
  
  const deleteUserItem = async () => {
    if (!selectedUser) return;
    const response = await deleteUser(selectedUser.id);
    if (response?.status === 200) {
      getUsers();
      setOpenDelete(false);
    }
  };

  const openEditModal = (user: AdminUser) => {
    setFormErrors([]);
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setOpenEdit(true);
  };

  useEffect(() => {
    getUsers();
  }, [filters]);

  const inputClasses = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all duration-200";
  const selectClasses = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all duration-200 bg-white";

  return (
    <div className="px-8 py-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">User Management</h2>
            <p className="text-sm text-gray-500">Manage admin and staff accounts</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              name="name" 
              value={filters.name} 
              onChange={handleFilterChange} 
              className="pl-10 pr-4 py-2.5 w-64 text-sm bg-white border border-gray-200 rounded-xl
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all" 
              placeholder="Search users..." 
            />
          </div>

          {/* Add button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFormErrors([]);
              setUserForm(defaultForm);
              setShowPassword(false);
              setOpenCreate(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 toothline-accent text-white text-sm font-medium 
                       rounded-xl hover:toothline-accent-hover transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add User
          </motion.button>
        </div>
      </motion.div>

      {/* Security Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
      >
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-purple-600" />
          <div>
            <p className="text-sm font-medium text-purple-800">Security Best Practices</p>
            <p className="text-xs text-purple-600">Ensure all users have strong passwords and appropriate role assignments.</p>
          </div>
        </div>
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
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={`skeleton-${i}`}>
                      <td className="px-6 py-4"><div className="h-10 bg-gray-100 rounded-lg animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-48 bg-gray-100 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-24 bg-gray-100 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : users?.length ? (
                  users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 
                                          flex items-center justify-center text-purple-600 font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openEditModal(user)}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenDelete(true);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Shield size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No users found</p>
                        <p className="text-gray-400 text-sm mt-1">Add a user to get started</p>
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

      {/* Create User Modal */}
      <Modal isOpen={openCreate} title="Add New User" onClose={() => setOpenCreate(false)}>
        <div className="space-y-5">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="mr-2 text-teal-500" />
              Full Name <span className="text-red-400 ml-1">*</span>
            </label>
            <input 
              type="text" 
              name="name" 
              value={userForm.name} 
              onChange={handleFormChange} 
              className={inputClasses}
              placeholder="e.g., John Doe" 
            />
            <ErrorText field="name" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="mr-2 text-teal-500" />
              Email <span className="text-red-400 ml-1">*</span>
            </label>
            <input 
              type="email" 
              name="email" 
              value={userForm.email} 
              onChange={handleFormChange} 
              className={inputClasses}
              placeholder="e.g., john@toothline.com" 
            />
            <ErrorText field="email" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Lock size={16} className="mr-2 text-teal-500" />
              Password <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={userForm.password} 
                onChange={handleFormChange} 
                className={`${inputClasses} pr-10`}
                placeholder="Enter password" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <ErrorText field="password" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserCog size={16} className="mr-2 text-teal-500" />
              Role <span className="text-red-400 ml-1">*</span>
            </label>
            <select 
              name="role" 
              value={userForm.role} 
              onChange={handleFormChange} 
              className={selectClasses}
            >
              <option value="STAFF">Staff</option>
              <option value="DENTIST">Dentist</option>
              <option value="ADMIN">Admin</option>
            </select>
            <ErrorText field="role" errors={formErrors} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpenCreate(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl 
                         hover:bg-gray-100 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={createNewUser}
              className="px-5 py-2.5 toothline-accent text-white font-medium rounded-xl 
                         hover:toothline-accent-hover transition-colors"
            >
              Create User
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={openEdit} title="Edit User" onClose={() => setOpenEdit(false)}>
        <div className="space-y-5">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="mr-2 text-teal-500" />
              Full Name <span className="text-red-400 ml-1">*</span>
            </label>
            <input 
              type="text" 
              name="name" 
              value={userForm.name} 
              onChange={handleFormChange} 
              className={inputClasses}
            />
            <ErrorText field="name" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="mr-2 text-teal-500" />
              Email <span className="text-red-400 ml-1">*</span>
            </label>
            <input 
              type="email" 
              name="email" 
              value={userForm.email} 
              onChange={handleFormChange} 
              className={inputClasses}
            />
            <ErrorText field="email" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Lock size={16} className="mr-2 text-teal-500" />
              New Password <span className="text-gray-400 text-xs ml-1">(leave blank to keep current)</span>
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={userForm.password} 
                onChange={handleFormChange} 
                className={`${inputClasses} pr-10`}
                placeholder="Enter new password" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserCog size={16} className="mr-2 text-teal-500" />
              Role <span className="text-red-400 ml-1">*</span>
            </label>
            <select 
              name="role" 
              value={userForm.role} 
              onChange={handleFormChange} 
              className={selectClasses}
            >
              <option value="STAFF">Staff</option>
              <option value="DENTIST">Dentist</option>
              <option value="ADMIN">Admin</option>
            </select>
            <ErrorText field="role" errors={formErrors} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpenEdit(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl 
                         hover:bg-gray-100 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={editUser}
              className="px-5 py-2.5 toothline-accent text-white font-medium rounded-xl 
                         hover:toothline-accent-hover transition-colors"
            >
              Update User
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal isOpen={openDelete} title="Delete User" onClose={() => setOpenDelete(false)} size="sm">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 size={32} className="text-red-500" />
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold">{selectedUser?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpenDelete(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl 
                         hover:bg-gray-100 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={deleteUserItem}
              className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-xl 
                         hover:bg-red-600 transition-colors"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SecurityPage;
