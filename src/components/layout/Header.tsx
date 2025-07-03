import { useState, useRef, useEffect } from 'react';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b px-6 py-4 shadow-sm flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">Toothline Admin Dashboard</h1>

      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={() => setOpen((prev) => !prev)}
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="Avatar"
            className="w-9 h-9 rounded-full border"
          />
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            Admin
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
            <ul className="py-1 text-sm text-gray-700">
              <li>
                <a
                  href="/admin/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;