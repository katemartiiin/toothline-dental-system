import { useEffect, useState } from 'react';
import ErrorText from '../../components/ErrorText';
import { type FieldError } from '../../utils/toastMessage';
import { fetchCurrentUser, updateProfile, type ProfileForm  } from '../../api/users';
const UserProfilePage: React.FC = () => {
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    email: '',
    role: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCurrentUser = async () => {
    try {
      const res = await fetchCurrentUser();
      setProfileForm({
        name: res?.name,
        email: res?.email,
        role: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Failed to get current user', error);
    }
  }

  const updateUserProfile = async () => {
    setFormErrors([]);
    const updateResponse = await updateProfile(profileForm);
    
    if (updateResponse.status == 400) {
      setFormErrors(updateResponse.errors);
    } else {
      getCurrentUser();
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <div className="w-full flex flex-wrap px-16 py-2">

      {/* Cards */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
         <h4 className="fw-500">Profile Information</h4>
         <div className="w-full text-sm my-5">
            <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Name</label>
                <input type="text" id="name" name="name" value={profileForm.name} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                <ErrorText field="name" errors={formErrors} />
            </div>
            <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Email</label>
                <input type="email" id="email" name="email" value={profileForm.email} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., janedoe@example.com" />
                <ErrorText field="email" errors={formErrors} />
            </div>

            <div className="text-right">
                <button type="button" onClick={() => updateUserProfile()} className="px-4 py-2 text-sm toothline-accent text-white rounded hover:toothline-primary">
                  Update Profile
                </button>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
         <h4 className="fw-500">Change Password</h4>
         <div className="w-full text-sm my-5">
            <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Current Password</label>
                <input type="password" id="currentPassword" name="currentPassword" value={profileForm.currentPassword} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="Enter current password" />
                <ErrorText field="currentPassword" errors={formErrors} />
            </div>
            <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">New Password</label>
                <input type="password" id="newPassword" name="newPassword" value={profileForm.newPassword} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="Enter new password" />
                <ErrorText field="newPassword" errors={formErrors} />
            </div>
            <div className="mb-4">
                <label className="block text-sm fw-500 toothline-text">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={profileForm.confirmPassword} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="Confirm new password" />
                <ErrorText field="confirmPassword" errors={formErrors} />
            </div>

            <div className="text-right">
                <button type="button" onClick={() => updateUserProfile()} className="px-4 py-2 text-sm toothline-accent text-white rounded hover:toothline-primary">
                  Update Password
                </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;
