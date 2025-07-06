import logo from '../../assets/logo-admin-white.png';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, credentials);
      const token = res.data.token;
      login(token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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