import { useState } from 'react';
import { type User } from '../../api/users';
import Modal from '../../components/Modal';
import { updateUserAsAdmin, type UpdateUserForm } from '../../api/security';
interface ResetPasswordProps {
  users: User[];
}
const ResetPassword = ({ users }: ResetPasswordProps) => {
    const [updateUserForm, setUpdateUserForm] = useState<UpdateUserForm>({
        role: '',
        resetPassword: false,
        locked: false
    });
    const [openReset, setOpenReset] = useState(false);

    const [userId, setUserId] = useState<number>(0);

    const handleUserSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUserId(Number(event.target.value));
    };

    const resetUserPassword = async () => {
        updateUserForm.resetPassword = true;
        const resetResponse = await updateUserAsAdmin(userId, updateUserForm);
        if (resetResponse?.status == 200) {
          setOpenReset(false);
          setUserId(0);
        }
    }
  return (
    <div className="">
        <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
         <h4 className="fw-500">Reset Password</h4>
         <div className="w-full text-sm my-5">
            <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Select User</label>
                <select id="userId" name="userId" value={userId} onChange={handleUserSelect} className="mt-1 block w-full rounded-md text-sm">
                    <option value="">Select user</option>
                    {users?.length ? (
                        users.map((user) => (
                        <option key={user.id} value={user.id}>
                        {user.name}
                        </option>
                        ))
                    ) : (
                        <option disabled selected>No User/s yet</option>
                    )}
                </select>
            </div>

            <div className="mt-10 text-right">
                <button type="button"
                onClick={() => setOpenReset(true)}
                className="px-4 py-2 text-sm toothline-accent text-white rounded hover:toothline-primary">
                  Reset Password
                </button>
            </div>
          </div>
        </div>
        {/* Reset Password Modal */}
        <Modal
            isOpen={openReset}
            title="Reset Password for User"
            onClose={() => setOpenReset(false)}
            >Are you sure you want to reset password for this user?
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setOpenReset(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => resetUserPassword()}
                className="px-4 py-2 toothline-bg-error text-white rounded hover:bg-red-600"
              >
                Reset Password
              </button>
          </div>
        </Modal>
    </div>
  );
};

export default ResetPassword;
