import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  Heart,
  ArrowUp,
  Sparkles
} from 'lucide-react';
import logo from '../../assets/logo-admin-white.png';

const Footer = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  const quickLinks = [
    { name: 'Our Services', href: '#services' },
    { name: 'Book Appointment', href: '#book' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ];

  return (
    <footer ref={footerRef} className="relative" id="contact">
      {/* Wave top decoration */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg 
          className="relative block w-full h-16" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#256D78"
          />
        </svg>
      </div>

      {/* Main footer content */}
      <div className="toothline-accent pt-20 pb-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto px-5"
        >
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand column */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <img src={logo} alt="Toothline" className="w-40 mb-4" />
              <p className="text-teal-100 text-sm leading-relaxed mb-6">
                Providing exceptional dental care with cutting-edge technology and compassionate service since 2010.
              </p>
              
              {/* Social links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-300" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <motion.a 
                      href={link.href}
                      className="text-teal-100 hover:text-white text-sm transition-colors inline-flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-yellow-300 mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="font-bold text-white mb-4">Contact Us</h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+15551234567" className="flex items-start text-teal-100 hover:text-white text-sm transition-colors group">
                    <Phone size={16} className="mr-3 mt-0.5 flex-shrink-0 group-hover:animate-pulse" />
                    <span>(555) 123-4567</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@toothline.com" className="flex items-start text-teal-100 hover:text-white text-sm transition-colors group">
                    <Mail size={16} className="mr-3 mt-0.5 flex-shrink-0" />
                    <span>info@toothline.com</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-start text-teal-100 text-sm">
                    <MapPin size={16} className="mr-3 mt-0.5 flex-shrink-0" />
                    <span>123 Dental Avenue<br />Health City, HC 12345</span>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Hours */}
            <motion.div variants={itemVariants}>
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <Clock size={16} />
                Clinic Hours
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between text-teal-100">
                  <span>Monday - Friday</span>
                  <span className="text-white font-medium">8:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between text-teal-100">
                  <span>Saturday</span>
                  <span className="text-white font-medium">9:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between text-teal-100">
                  <span>Sunday</span>
                  <span className="text-white font-medium">Closed</span>
                </li>
              </ul>
              
              {/* Emergency notice */}
              <motion.div 
                className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-xs text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Emergency services available 24/7
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <motion.div 
            variants={itemVariants}
            className="pt-8 border-t border-white/20"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-teal-100 text-sm flex items-center gap-1">
                © {new Date().getFullYear()} <a href="https://katejaneenmartin.com" target="_blank" className="font-semibold hover:underline">KJM</a> - Toothline Dental Clinic. All Rights Reserved.
              </p>
              
              <motion.button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-teal-100 hover:text-white text-sm transition-colors group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to top
                <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                  <ArrowUp size={16} />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
