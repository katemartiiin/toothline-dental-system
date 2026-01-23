import { motion } from 'framer-motion';
import { Heart, Coffee } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="w-full bg-white border-t border-gray-100 px-6 py-4"
    >
      <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <span>© {currentYear}</span>
          <span className="font-semibold text-gray-700"><a href="https://katejaneenmartin.com" target="_blank" className="font-semibold hover:underline">KJM</a> - Toothline</span>
          <span>All rights reserved.</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span>Built with</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <Coffee size={14} className="text-amber-600" />
          </motion.span>
          <span>&</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, delay: 0.5 }}
          >
            <Heart size={14} className="text-red-500 fill-red-500" />
          </motion.span>
          <span>using React, TypeScript & Tailwind CSS</span>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
