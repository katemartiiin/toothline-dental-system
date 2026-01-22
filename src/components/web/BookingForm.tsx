import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Stethoscope, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Shield
} from 'lucide-react';
import ErrorText from '../../components/ErrorText';
import { type FieldError } from '../../utils/toastMessage';

interface ServiceItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceId: string;
  notes: string;
}

type BookingFormProps = {
  services: ServiceItem[];
  minDate: string;
};

const InputField = ({ 
  icon: Icon, 
  label, 
  required = false,
  error,
  children 
}: { 
  icon: React.ElementType;
  label: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
      <Icon size={16} className="mr-2 text-teal-500" />
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <div className={`relative transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
      {children}
    </div>
  </div>
);

function BookingForm({ services, minDate }: BookingFormProps) {
  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, margin: "-50px" });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    appointmentDate: '',
    appointmentTime: '',
    serviceId: '',
    notes: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const defaultFormData: FormData = {
    name: '',
    email: '',
    phoneNumber: '',
    appointmentDate: '',
    appointmentTime: '',
    serviceId: '',
    notes: ''
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    setFormErrors(prev => prev.filter(err => err.field !== e.target.name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);
    setFormErrors([]);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/appointments`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setStatus('success');
      setFormData(defaultFormData);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
      if (err.response?.status === 400) {
        setFormErrors(err.response.data.errors);
      }
    }
  };

  const hasError = (field: string) => formErrors.some(e => e.field === field);

  const inputClasses = (field: string) => `
    w-full px-4 py-3 rounded-xl border-2 text-sm
    transition-all duration-300 bg-white
    ${hasError(field) 
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100' 
      : focusedField === field
        ? 'border-teal-400 ring-4 ring-teal-50'
        : 'border-gray-200 hover:border-gray-300 focus:border-teal-400 focus:ring-4 focus:ring-teal-50'
    }
    outline-none
  `;

  return (
    <motion.div 
      ref={formRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-5 md:mx-auto mb-3"
    >
      {/* Success State */}
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
            >
              <CheckCircle size={40} className="text-green-500" />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Appointment Requested!
            </h3>
            <p className="text-gray-500 mb-6">
              We've received your appointment request. Our team will contact you shortly to confirm your booking.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatus('idle')}
              className="px-6 py-3 toothline-accent text-white rounded-xl font-semibold hover:toothline-accent-hover transition-colors"
            >
              Book Another Appointment
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Form Header */}
            <div className="toothline-gradient p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold font-montserrat text-2xl flex items-center gap-2">
                    <Sparkles className="text-yellow-300" size={24} />
                    Book Your Appointment
                  </h3>
                  <p className="text-teal-100 mt-1 text-sm">
                    Fill out the form below and we'll get back to you within 24 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 md:p-8">
              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8 pb-6 border-b border-gray-100">
                <span className="flex items-center text-xs text-gray-500">
                  <Shield size={14} className="text-green-500 mr-1" />
                  Secure & Private
                </span>
                <span className="flex items-center text-xs text-gray-500">
                  <CheckCircle size={14} className="text-green-500 mr-1" />
                  No Spam Guarantee
                </span>
                <span className="flex items-center text-xs text-gray-500">
                  <Clock size={14} className="text-teal-500 mr-1" />
                  Quick Response
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <InputField icon={User} label="Full Name" required error={hasError('name')}>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('name')}
                    placeholder="Enter your full name" 
                  />
                  <ErrorText field="name" errors={formErrors} />
                </InputField>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-5">
                  <InputField icon={Mail} label="Email" required error={hasError('email')}>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClasses('email')}
                      placeholder="you@example.com" 
                    />
                    <ErrorText field="email" errors={formErrors} />
                  </InputField>

                  <InputField icon={Phone} label="Phone Number" required error={hasError('phoneNumber')}>
                    <input 
                      type="tel" 
                      name="phoneNumber" 
                      value={formData.phoneNumber} 
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phoneNumber')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClasses('phoneNumber')}
                      placeholder="(555) 123-4567" 
                    />
                    <ErrorText field="phoneNumber" errors={formErrors} />
                  </InputField>
                </div>

                {/* Date & Time */}
                <div className="grid md:grid-cols-2 gap-5">
                  <InputField icon={Calendar} label="Preferred Date" required error={hasError('appointmentDate')}>
                    <input 
                      type="date" 
                      name="appointmentDate" 
                      value={formData.appointmentDate} 
                      onChange={handleChange}
                      onFocus={() => setFocusedField('appointmentDate')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClasses('appointmentDate')}
                      min={minDate} 
                    />
                    <ErrorText field="appointmentDate" errors={formErrors} />
                  </InputField>

                  <InputField icon={Clock} label="Preferred Time" required error={hasError('appointmentTime')}>
                    <input 
                      type="time" 
                      name="appointmentTime" 
                      value={formData.appointmentTime} 
                      onChange={handleChange}
                      onFocus={() => setFocusedField('appointmentTime')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClasses('appointmentTime')}
                    />
                    <ErrorText field="appointmentTime" errors={formErrors} />
                  </InputField>
                </div>

                {/* Service Selection */}
                <InputField icon={Stethoscope} label="Service Needed" required error={hasError('serviceId')}>
                  <select 
                    name="serviceId" 
                    value={formData.serviceId} 
                    onChange={handleChange}
                    onFocus={() => setFocusedField('serviceId')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('serviceId')}
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <ErrorText field="serviceId" errors={formErrors} />
                </InputField>

                {/* Notes */}
                <InputField icon={MessageSquare} label="Additional Notes">
                  <textarea 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleChange}
                    onFocus={() => setFocusedField('notes')}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClasses('notes')} resize-none`}
                    rows={3}
                    placeholder="Any specific concerns or requests? Let us know..."
                  />
                </InputField>

                {/* Error Message */}
                <AnimatePresence>
                  {status === 'error' && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                    >
                      <AlertCircle size={18} />
                      {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 px-6 toothline-accent hover:toothline-accent-hover text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: status === 'loading' ? 1 : 1.01 }}
                  whileTap={{ scale: status === 'loading' ? 1 : 0.99 }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Calendar size={20} />
                      Submit Appointment Request
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  By submitting, you agree to our{' '}
                  <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
                  {' '}and{' '}
                  <a href="#" className="text-teal-600 hover:underline">Terms of Service</a>
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default BookingForm;
