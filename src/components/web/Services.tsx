import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Stethoscope, 
  Sparkles, 
  Wrench, 
  Scissors, 
  Baby, 
  Ambulance,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  badge?: string;
}

const services: ServiceItem[] = [
  {
    icon: <Stethoscope size={28} />,
    title: 'General Dentistry',
    description: 'Routine checkups, cleanings, fillings, and preventive care for the whole family.',
    features: ['Regular Checkups', 'Professional Cleaning', 'Cavity Fillings'],
    badge: 'Most Popular'
  },
  {
    icon: <Sparkles size={28} />,
    title: 'Cosmetic Dentistry',
    description: 'Transform your smile with teeth whitening, veneers, and complete smile makeovers.',
    features: ['Teeth Whitening', 'Porcelain Veneers', 'Smile Design'],
  },
  {
    icon: <Wrench size={28} />,
    title: 'Orthodontics',
    description: 'Achieve perfectly aligned teeth with modern braces and invisible aligners.',
    features: ['Traditional Braces', 'Clear Aligners', 'Retainers'],
    badge: 'New'
  },
  {
    icon: <Scissors size={28} />,
    title: 'Oral Surgery',
    description: 'Expert surgical procedures including extractions and dental implants.',
    features: ['Tooth Extraction', 'Dental Implants', 'Bone Grafting'],
  },
  {
    icon: <Baby size={28} />,
    title: 'Pediatric Dentistry',
    description: 'Gentle, specialized dental care designed specifically for children.',
    features: ['Child-Friendly Care', 'Preventive Treatment', 'Sealants'],
  },
  {
    icon: <Ambulance size={28} />,
    title: 'Emergency Care',
    description: 'Immediate treatment for dental emergencies, available when you need us.',
    features: ['24/7 Availability', 'Same-Day Service', 'Pain Relief'],
    badge: '24/7'
  },
];

const ServiceCard = ({ service, index }: { service: ServiceItem; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="group relative"
    >
      <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-teal-200 overflow-hidden h-full">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badge */}
        {service.badge && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
              service.badge === 'New' 
                ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white' 
                : service.badge === '24/7'
                ? 'bg-red-100 text-red-600'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {service.badge}
          </motion.span>
        )}

        {/* Icon */}
        <motion.div 
          className="w-16 h-16 rounded-2xl toothline-secondary flex items-center justify-center mb-5 toothline-text-accent group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {service.icon}
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:toothline-text-accent transition-colors">
          {service.title}
        </h3>
        
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
          {service.description}
        </p>

        {/* Features list */}
        <ul className="space-y-2 mb-5">
          {service.features.map((feature, idx) => (
            <motion.li 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.4 + index * 0.1 + idx * 0.05 }}
              className="flex items-center text-sm text-gray-600"
            >
              <CheckCircle2 size={14} className="text-teal-500 mr-2 flex-shrink-0" />
              {feature}
            </motion.li>
          ))}
        </ul>

        {/* Learn more link */}
        <motion.a 
          href="#"
          className="inline-flex items-center text-sm font-semibold toothline-text-accent group/link"
          whileHover={{ x: 5 }}
        >
          Learn more 
          <ArrowRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
        </motion.a>
      </div>
    </motion.div>
  );
};

function Services() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-6xl mx-auto px-5" ref={sectionRef}>
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full toothline-secondary toothline-text-accent text-sm font-semibold mb-4"
          >
            Our Services
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-5 text-gray-800">
            Comprehensive{' '}
            <span className="text-gradient">Dental Care</span>
          </h2>
          
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
            From routine checkups to advanced procedures, we provide complete dental solutions 
            tailored to your unique needs.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 mb-4">
            Not sure which service you need?
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-teal-500 text-teal-600 rounded-full font-semibold hover:bg-teal-50 transition-colors"
          >
            Schedule a Consultation
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default Services;
