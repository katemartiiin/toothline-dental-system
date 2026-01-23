import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { LogOut, UserRoundPen, Bell, Search,ChevronDown,Settings,HelpCircle } from 'lucide-react';
import axios from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

type HeaderProps = {
  title: string;
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { userName, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed or already logged out:', err);
    } finally {
      logout();
      navigate('/admin/login');
    }
  };

  // Test notifications
  const notifications = [
    { id: 1, title: 'New appointment', message: 'John Doe booked for tomorrow at 10:00 AM', time: '5m ago', unread: true },
    { id: 2, title: 'Appointment cancelled', message: 'Jane Smith cancelled her appointment', time: '1h ago', unread: true },
    { id: 3, title: 'System update', message: 'New features available', time: '2h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-gray-100 px-8 py-4 shadow-sm sticky top-0 z-40"
    >
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <motion.h1 
            key={title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-montserrat text-xl font-bold toothline-text-accent"
          >
            {title}
          </motion.h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <motion.div 
            className={`
              relative flex items-center transition-all duration-300
              ${searchFocused ? 'w-64' : 'w-48'}
            `}
          >
            <Search size={18} className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl
                         focus:bg-white focus:border-teal-300 focus:ring-2 focus:ring-teal-100 
                         transition-all duration-200 outline-none"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </motion.div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                         rounded-xl transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white 
                             text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 
                             rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                      Mark all as read
                    </button>
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer
                          transition-colors ${notification.unread ? 'bg-teal-50/50' : ''}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <span className="w-2 h-2 mt-2 bg-teal-500 rounded-full flex-shrink-0" />
                          )}
                          <div className={notification.unread ? '' : 'ml-5'}>
                            <p className="text-sm font-medium text-gray-800">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-3 bg-gray-50">
                    <button className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200" />

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 p-1.5 pr-3 rounded-xl hover:bg-gray-50 
                         transition-colors focus:outline-none"
              onClick={() => setOpen((prev) => !prev)}
            >
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=3eb8c0&color=fff&bold=true`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-xl border-2 border-teal-100"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>
              
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-700">{userName}</p>
                <p className="text-xs text-gray-400">{userRole}</p>
              </div>
              
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-200 
                           ${open ? 'rotate-180' : ''}`}
              />
            </motion.button>

            <AnimatePresence>
              {open && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 
                             rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  {/* User info */}
                  <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{userName}</p>
                    <p className="text-xs text-gray-500">{userRole}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <motion.a
                      href="/admin/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 
                                 hover:bg-gray-50 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <UserRoundPen size={16} className="mr-3 text-gray-400" />
                      My Profile
                    </motion.a>
                    
                    <motion.a
                      href="/admin/settings"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 
                                 hover:bg-gray-50 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <Settings size={16} className="mr-3 text-gray-400" />
                      Settings
                    </motion.a>
                    
                    <motion.a
                      href="#"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 
                                 hover:bg-gray-50 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <HelpCircle size={16} className="mr-3 text-gray-400" />
                      Help & Support
                    </motion.a>
                  </div>

                  {/* Logout */}
                  <div className="py-2 border-t border-gray-100">
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 
                                 hover:bg-red-50 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <LogOut size={16} className="mr-3" />
                      Log out
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
