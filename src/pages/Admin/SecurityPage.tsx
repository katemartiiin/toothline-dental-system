import { useState } from 'react';
import Modal from '../../components/Modal';
const SecurityPage: React.FC = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openLock, setOpenLock] = useState(false);
  return (
    <div className="w-full flex flex-wrap px-16 py-2">

      {/* Cards */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
         <h4 className="fw-500">Change Password</h4>
         <div className="w-full text-sm my-5">
            <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Current Password</label>
                <input type="password" id="currentPassword" name="currentPassword" className="mt-1 block w-full rounded-md text-sm" placeholder="Enter current password" />
            </div>
            <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">New Password</label>
                <input type="password" id="newPassword" name="newPassword" className="mt-1 block w-full rounded-md text-sm" placeholder="Enter new password" />
            </div>
            <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" className="mt-1 block w-full rounded-md text-sm" placeholder="Confirm new password" />
            </div>

            <div className="text-right">
                <button type="button"className="px-4 py-2 text-sm toothline-accent text-white rounded hover:toothline-primary">
                  Update Password
                </button>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
         <div>
            <h4 className="fw-500">Audit Log (Recent Activities)</h4>
            <div className="w-full text-sm space-y-3 my-5">
              <p>[2025-06-28 14:30] Admin User changed password.</p>
              <p>[2025-06-28 14:30] Dr. Melissa Chen updated schedule #1.</p>
              <p>[2025-06-28 14:30] New service "Teeth Whitening" added.</p>
              <p>[2025-06-28 14:30] Patient PT-1001 record updated.</p>
            </div>
         </div>
         <div className="w-full flex items-end justify-end">
              <button type="button"className="px-4 py-2 text-sm toothline-text-accent fw-600">
                View Full Audit Log
              </button>
          </div>
        </div>

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
          <p>Admin User</p>
          <p>admin@toothline.com</p>
          <p className="toothline-text-primary">Admin</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit Role</button>
          </div>
        </div>

        <div className="w-full grid grid-cols-4 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Dr. Melissa Chen</p>
          <p>melissa.c@toothline.com</p>
          <p className="toothline-success">Dentist</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit Role</button>
            <button type="button" onClick={() => setOpenLock(true)} className="toothline-error fw-500">Lock</button>
          </div>
        </div>

        <div className="w-full grid grid-cols-4 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Sarah Reception</p>
          <p>sarah.r@toothline.com</p>
          <p className="toothline-error">Staff</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit Role</button>
            <button type="button" onClick={() => setOpenLock(true)} className="toothline-error fw-500">Lock</button>
          </div>
        </div>


        {/* Create User */}
          <Modal
            isOpen={openCreate}
            title="Create New User"
            confirmText="Create User"
            cancelText="Cancel"
            onClose={() => setOpenCreate(false)}
            onConfirm={() => {
                console.log('User created!');
              }}
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
            confirmText="Save changes"
            cancelText="Cancel"
            onClose={() => setOpenEdit(false)}
            onConfirm={() => {
                console.log('User updated!');
              }}
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
            confirmText="Yes, Lock"
            cancelText="Cancel"
            onClose={() => setOpenLock(false)}
            onConfirm={() => {
                console.log('User locked!');
              }}
            >Are you sure you want to lock this user?
          </Modal>

      </div>
    </div>
  );
};

export default SecurityPage;
