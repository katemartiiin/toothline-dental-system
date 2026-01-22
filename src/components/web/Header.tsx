import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Clock, Sparkles } from 'lucide-react';
import logo from '../../assets/logo-v1.png';

type HeaderProps = {
  onScrollToBook: () => void;
};

const Header = ({ onScrollToBook }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top bar with contact info */}
      <motion.div 
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block toothline-accent text-white py-2"
      >
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-2">
              <Phone size={14} className="animate-pulse" />
              (555) 123-4567
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} />
              Mon-Fri: 8AM - 6PM
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-yellow-300" />
            <span>New patients welcome!</span>
          </div>
        </div>
      </motion.div>

      {/* Main header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-white'
        }`}
      >
        <div className="max-w-6xl flex flex-wrap mx-auto py-4 md:px-0 px-4">
          <div className="w-1/2 flex items-center">
            <motion.img 
              src={logo} 
              className="w-36 md:w-40 cursor-pointer" 
              alt="Toothline Logo"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="w-1/2 hidden md:flex items-center justify-end space-x-6">
            <nav className="flex items-center space-x-6 mr-6">
              <motion.a 
                href="#services" 
                className="text-gray-600 hover:text-teal-600 font-medium underline-animate transition-colors"
                whileHover={{ y: -2 }}
              >
                Services
              </motion.a>
              <motion.a 
                href="#about" 
                className="text-gray-600 hover:text-teal-600 font-medium underline-animate transition-colors"
                whileHover={{ y: -2 }}
              >
                About
              </motion.a>
              <motion.a 
                href="#contact" 
                className="text-gray-600 hover:text-teal-600 font-medium underline-animate transition-colors"
                whileHover={{ y: -2 }}
              >
                Contact
              </motion.a>
            </nav>
            
            <motion.button 
              type="button" 
              onClick={onScrollToBook} 
              className="relative overflow-hidden group font-bold toothline-accent hover:toothline-accent-hover text-white px-5 py-2.5 rounded-full text-sm transition-all duration-300 shadow-md hover:shadow-lg btn-press"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                Book Appointment
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="w-1/2 flex md:hidden items-center justify-end">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t"
            >
              <nav className="flex flex-col p-4 space-y-3">
                <a 
                  href="#services" 
                  className="text-gray-600 hover:text-teal-600 font-medium py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </a>
                <a 
                  href="#about" 
                  className="text-gray-600 hover:text-teal-600 font-medium py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  className="text-gray-600 hover:text-teal-600 font-medium py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <button 
                  type="button" 
                  onClick={() => {
                    onScrollToBook();
                    setIsMobileMenuOpen(false);
                  }}
                  className="font-bold toothline-accent text-white px-5 py-3 rounded-full text-sm transition-all duration-300"
                >
                  Book Appointment
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
