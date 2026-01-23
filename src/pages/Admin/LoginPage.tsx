import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {  Mail, Lock,  Eye,  EyeOff,  LogIn, Loader2, AlertCircle } from 'lucide-react';
import ErrorText from '../../components/ErrorText';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo-admin-white.png';
import { type FieldError } from '../../utils/toastMessage';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const invalidCreds = useRef<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    invalidCreds.current = "";
    setIsLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, credentials);
      login(res.data);
      window.location.href = `${import.meta.env.VITE_APP_URL}/admin/dashboard`;
    } catch (err: any) {
      if (err.response?.data?.status == 400) {
        setFormErrors(err.response.data.errors);
      } else if (err.response?.data?.status == 401) {
        invalidCreds.current = err.response.data.message;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasError = (field: string) => formErrors.some(e => e.field === field);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 toothline-gradient-radial">
        {/* Floating circles */}
        <motion.div 
          className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-400/10 rounded-full"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Login card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md mx-4"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <motion.img
              src={logo}
              alt="Toothline Logo"
              className="w-80 mx-auto mb-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-10">
            {/* Email field */}
            <motion.div variants={itemVariants} className="mb-5">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className={`
                relative flex items-center rounded-xl border-2 transition-all duration-300
                ${focusedField === 'email' 
                  ? 'border-white/50 bg-white/30' 
                  : hasError('email')
                    ? 'border-red-400/50 bg-white/20'
                    : 'border-white/20 bg-white/20'
                }
              `}>
                <Mail size={18} className="ml-4 text-white/70" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3.5 bg-transparent text-white placeholder-white/50 
                             focus:outline-none text-sm border-none"
                  placeholder="Enter your email"
                />
              </div>
              <ErrorText field="email" errors={formErrors} />
            </motion.div>

            {/* Password field */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Password
              </label>
              <div className={`
                relative flex items-center rounded-xl border-2 transition-all duration-300
                ${focusedField === 'password' 
                  ? 'border-white/50 bg-white/30' 
                  : hasError('password')
                    ? 'border-red-400/50 bg-white/20'
                    : 'border-white/20 bg-white/20'
                }
              `}>
                <Lock size={18} className="ml-4 text-white/70" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3.5 bg-transparent text-white placeholder-white/50 
                             focus:outline-none text-sm border-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <ErrorText field="password" errors={formErrors} />
              
              {/* Error message */}
              {invalidCreds.current && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 text-red-300 text-sm"
                >
                  <AlertCircle size={16} />
                  {invalidCreds.current}
                </motion.div>
              )}

              {/* Forgot password link */}
              <div className="text-right mt-3">
                <a 
                  href="#" 
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-white text-teal-700 font-bold rounded-xl
                           hover:bg-white/90 transition-all duration-300 shadow-lg
                           disabled:opacity-70 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Footer text */}
        <motion.p
          variants={itemVariants}
          className="text-center text-white/50 text-sm mt-6"
        >
          © {new Date().getFullYear()} <a href="https://katejaneenmartin.com" target="_blank" className="font-semibold hover:underline">KJM</a> - Toothline Dental Clinic. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
