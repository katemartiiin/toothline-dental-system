import logo from '../../assets/logo-admin-white.png';
const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center toothline-primary">
      <div className="toothline-primary-login p-8 rounded-lg shadow-md w-full max-w-sm mx-5 md:mx-0">
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="Toothline Logo"
          />
        </div>

        <form className="font-opensans">
          <div className="mb-4">
            <label className="block text-white mb-1 text-sm" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
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