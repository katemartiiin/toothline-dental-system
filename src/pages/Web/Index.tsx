import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Star, 
  Users, 
  Award, 
  Clock,
  ChevronDown,
  Sparkles,
  Shield,
  Heart
} from 'lucide-react';
import Header from '../../components/web/Header';
import Footer from '../../components/web/Footer';
import Services from '../../components/web/Services';
import { scrollToRef } from '../../utils/scrollToRef';
import BookingForm from '../../components/web/BookingForm';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

// Stats data
const stats = [
  { icon: Users, value: '15,000+', label: 'Happy Patients' },
  { icon: Award, value: '25+', label: 'Years Experience' },
  { icon: Star, value: '4.9', label: 'Patient Rating' },
  { icon: Clock, value: '24/7', label: 'Emergency Care' },
];

// Trust badges
const trustBadges = [
  { icon: Shield, text: 'Licensed & Certified' },
  { icon: Heart, text: 'Gentle Care Approach' },
  { icon: Award, text: 'Award Winning Clinic' },
];

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [minDate, setMinDate] = useState<string>("");
  const bookRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  
  // Parallax effect for hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    setMinDate(formattedDate);

    axios.get(`${apiUrl}/services`)
      .then(response => {
        setServices(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch services:', error);
        setLoading(false);
      });
  }, []);

  const handleScrollToBook = () => {
    scrollToRef(bookRef);
  };

  return (
    <div className="w-full bg-white font-opensans overflow-hidden">
      {/* Header */}
      <Header onScrollToBook={handleScrollToBook} />

      {/* Main */}
      <main>
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative min-h-[90vh] flex items-center toothline-gradient-radial overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating circles */}
            <motion.div 
              className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full"
              animate={{ 
                y: [0, -20, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full"
              animate={{ 
                y: [0, 20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1 
              }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/3 w-40 h-40 bg-cyan-400/10 rounded-full"
              animate={{ 
                x: [0, 30, 0],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 7, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5 
              }}
            />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>

          {/* Hero content */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 max-w-6xl mx-auto px-5 py-20 text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-8"
            >
              <Sparkles size={16} className="text-yellow-300" />
              <span>Trusted by 15,000+ Happy Patients</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-montserrat font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl text-white mb-6"
            >
              Your Smile,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                Our Priority
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-teal-100 max-w-2xl mx-auto mb-10"
            >
              Experience world-class dental care delivered by our dedicated team of specialists 
              using cutting-edge technology in a comfortable environment.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <motion.button 
                onClick={handleScrollToBook}
                className="group relative overflow-hidden px-8 py-4 bg-white text-teal-700 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                  Book Your Visit
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.a 
                href="#services"
                className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Services
              </motion.a>
            </motion.div>

            {/* Trust badges */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 text-white/80 text-sm"
            >
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <badge.icon size={18} className="text-yellow-300" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center text-white/60 cursor-pointer"
              onClick={() => {
                const servicesSection = document.getElementById('services');
                servicesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="text-xs mb-2">Scroll to explore</span>
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>

          {/* Wave bottom */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg 
              viewBox="0 0 1440 120" 
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <path 
                fill="#ffffff" 
                d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,101.3C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              />
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white relative z-10 -mt-1">
          <div className="max-w-6xl mx-auto px-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl toothline-secondary flex items-center justify-center">
                    <stat.icon size={28} className="toothline-text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dental Services */}
        <Services />

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Image/Illustration side */}
              <div className="relative">
                <motion.div 
                  className="aspect-square rounded-3xl toothline-gradient p-8 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/10 rounded-full" />
                  
                  <div className="relative z-10 h-full flex flex-col justify-center text-white text-center">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="text-8xl mb-4"
                    >
                      🦷
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Modern Equipment</h3>
                    <p className="text-teal-100">State-of-the-art technology for precise diagnostics and treatment</p>
                  </div>
                </motion.div>
                
                {/* Floating badge */}
                <motion.div 
                  className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star size={24} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">4.9 Rating</div>
                      <div className="text-xs text-gray-500">500+ Reviews</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Content side */}
              <div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-block px-4 py-2 rounded-full toothline-secondary toothline-text-accent text-sm font-semibold mb-4"
                >
                  Why Choose Us
                </motion.span>
                
                <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-800 mb-6">
                  Dental Care That Puts{' '}
                  <span className="text-gradient">You First</span>
                </h2>
                
                <p className="text-gray-500 mb-8 leading-relaxed">
                  At Toothline, we combine advanced dental technology with a warm, 
                  patient-centered approach. Our experienced team is dedicated to making 
                  your visit comfortable and your smile radiant.
                </p>

                <ul className="space-y-4">
                  {[
                    'Experienced & certified dental professionals',
                    'Latest technology for pain-free procedures',
                    'Personalized treatment plans for every patient',
                    'Flexible scheduling & emergency appointments',
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 text-gray-600"
                    >
                      <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Booking Form Section */}
        <section ref={bookRef} id="book" className="py-20 toothline-gradient-light relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 px-5"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white toothline-text-accent text-sm font-semibold mb-4 shadow-sm">
                Get Started Today
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-800 mb-4">
                Ready to Transform Your Smile?
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Schedule your appointment today and take the first step towards a healthier, 
                more confident smile.
              </p>
            </motion.div>

            <BookingForm services={services} minDate={minDate} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
