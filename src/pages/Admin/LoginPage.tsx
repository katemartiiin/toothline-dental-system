import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorText from '../../components/ErrorText';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo-admin-white.png';
import { type FieldError } from '../../utils/toastMessage';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);

  const { login } = useAuth();
  const navigate = useNavigate();
  const invalidCreds = useRef<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, credentials);
      login(res.data);
      window.location.href = `${import.meta.env.VITE_APP_URL}/admin/dashboard`;
      // navigate('/admin/dashboard');
    } catch (err: any) {
      if (err.response.data.status == 400) {
        setFormErrors(err.response.data.errors);
      } else if (err.response.data.status == 401) {
        invalidCreds.current = err.response.data.message;
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center toothline-primary">
      <div className="toothline-primary-login p-8 rounded-lg shadow-md w-full max-w-sm mx-5 md:mx-0">
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="Toothline Logo"
          />
        </div>

        <form onSubmit={handleSubmit} className="font-opensans">
          <div className="mb-4">
            <label className="block text-white mb-1 text-sm" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full px-3 py-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-300 text-sm"
            />
            <ErrorText field="email" errors={formErrors} />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1 text-sm" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-3 py-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-300 text-sm"
            />
            <ErrorText field="password" errors={formErrors} />
            {invalidCreds && (
              <p className="mt-1 text-xs toothline-error">{invalidCreds.current}</p>
            )}
            <div className="text-right mt-1">
              <a href="#" className="text-xs text-white hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="text-sm w-full toothline-primary-darker hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded mt-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;