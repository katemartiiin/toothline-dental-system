import { useState, useRef, useEffect } from 'react';
import { LogOut, UserRoundPen } from 'lucide-react';
type HeaderProps = {
  title: string;
};
const Header: React.FC<HeaderProps> = ({ title }) => {
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
    <header className="bg-white border-b px-20 py-4 shadow-sm flex items-center justify-between">
      <h1 className="font-montserrat text-xl fw-800 toothline-text-accent">{title}</h1>

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
                  className="flex px-4 py-2 hover:bg-gray-100"
                >
                  <UserRoundPen size={15} className="mr-2 my-auto" /> Profile
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="flex w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  <LogOut size={15} className="mr-2 my-auto" /> Logout
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