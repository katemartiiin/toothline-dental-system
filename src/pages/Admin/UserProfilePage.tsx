import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {  User, Mail, Lock, Eye, EyeOff, Save, Shield, Camera, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ErrorText from '../../components/ErrorText';
import { type FieldError } from '../../utils/toastMessage';
import { updateProfile, changePassword } from '../../api/profile';

const UserProfilePage: React.FC = () => {
  const { userName, userRole, userEmail } = useAuth();
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<FieldError[]>([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: userName || '',
    email: userEmail || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async () => {
    setFormErrors([]);
    const response = await updateProfile(profileForm);
    if (response?.status === 400) {
      setFormErrors(response.errors);
    } else {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const handlePasswordSubmit = async () => {
    setPasswordErrors([]);
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrors([{ field: 'confirmPassword', message: 'Passwords do not match' }]);
      return;
    }

    const response = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });

    if (response?.status === 400) {
      setPasswordErrors(response.errors);
    } else {
      setPasswordSaved(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSaved(false), 3000);
    }
  };

  useEffect(() => {
    setProfileForm({
      name: userName || '',
      email: userEmail || ''
    });
  }, [userName, userEmail]);

  const inputClasses = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all duration-200";

  return (
    <div className="px-8 py-4 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
          <p className="text-sm text-gray-500">Manage your account settings</p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=3eb8c0&color=fff&bold=true&size=120`}
                alt="Avatar"
                className="w-24 h-24 rounded-2xl border-4 border-teal-100"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 p-2 bg-teal-500 text-white rounded-xl shadow-lg"
              >
                <Camera size={16} />
              </motion.button>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">{userName}</h3>
            <p className="text-sm text-gray-500 mb-4">{userEmail}</p>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              <Shield size={14} />
              {userRole}
            </span>
          </div>
        </motion.div>

        {/* Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
              {profileSaved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 text-green-600 text-sm"
                >
                  <CheckCircle2 size={16} />
                  Saved!
                </motion.span>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="mr-2 text-teal-500" />
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={profileForm.name} 
                  onChange={handleProfileChange} 
                  className={inputClasses}
                />
                <ErrorText field="name" errors={formErrors} />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="mr-2 text-teal-500" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={profileForm.email} 
                  onChange={handleProfileChange} 
                  className={inputClasses}
                />
                <ErrorText field="email" errors={formErrors} />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProfileSubmit}
                className="flex items-center gap-2 px-5 py-2.5 toothline-accent text-white font-medium 
                           rounded-xl hover:toothline-accent-hover transition-colors"
              >
                <Save size={18} />
                Save Changes
              </motion.button>
            </div>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
              {passwordSaved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 text-green-600 text-sm"
                >
                  <CheckCircle2 size={16} />
                  Password changed!
                </motion.span>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} className="mr-2 text-teal-500" />
                  Current Password
                </label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    name="currentPassword" 
                    value={passwordForm.currentPassword} 
                    onChange={handlePasswordChange} 
                    className={`${inputClasses} pr-10`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ErrorText field="currentPassword" errors={passwordErrors} />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} className="mr-2 text-teal-500" />
                  New Password
                </label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    name="newPassword" 
                    value={passwordForm.newPassword} 
                    onChange={handlePasswordChange} 
                    className={`${inputClasses} pr-10`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ErrorText field="newPassword" errors={passwordErrors} />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} className="mr-2 text-teal-500" />
                  Confirm New Password
                </label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword" 
                    value={passwordForm.confirmPassword} 
                    onChange={handlePasswordChange} 
                    className={`${inputClasses} pr-10`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ErrorText field="confirmPassword" errors={passwordErrors} />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePasswordSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-medium 
                           rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Lock size={18} />
                Update Password
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
