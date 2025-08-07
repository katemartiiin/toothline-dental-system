import { useState } from 'react';
import axios from 'axios';
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
function BookingForm({ services, minDate }: BookingFormProps) {
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

    const defaultFormData: FormData = {
        name: '',
        email: '',
        phoneNumber: '',
        appointmentDate: '',
        appointmentTime: '',
        serviceId: '',
        notes: ''
    };

    const [formErrors, setFormErrors] = useState<FieldError[]>([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage(null);
        setFormErrors([]);

        try {
        const response = await axios.post(
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
            setErrorMessage(err.response?.data?.message || 'Something went wrong.');
            if (err.response.status == 400) {
                setFormErrors(err.response.data.errors);
            }
        }
    };

  return (
    <div className="max-w-2xl bg-white rounded-lg shadow-md p-7 mx-5 md:mx-auto mb-3">
        <h3 className="font-bold font-montserrat text-2xl mb-5">Book Your Appointment</h3>

        <div className="my-5">
            <label className="text-sm toothline-text">Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400" placeholder="Enter your full name" />
            <ErrorText field="name" errors={formErrors} />
        </div>

        <div className="my-5">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div>
                    <label className="text-sm toothline-text">Email *</label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400" placeholder="Enter your email" />
                    <ErrorText field="email" errors={formErrors} />
                </div>
                <div>
                    <label className="text-sm toothline-text">Phone Number *</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400" placeholder="Enter your phone" />
                    <ErrorText field="phoneNumber" errors={formErrors} />
                </div>
            </div>
        </div>

        <div className="my-5">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div>
                    <label className="text-sm toothline-text">Preferred Date *</label>
                    <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400" min={minDate} />
                    <ErrorText field="appointmentDate" errors={formErrors} />
                </div>
                <div>
                    <label className="text-sm toothline-text">Preferred Time *</label>
                    <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400" />
                    <ErrorText field="appointmentTime" errors={formErrors} />
                </div>
            </div>
        </div>

        <div className="my-5">
            <label className="text-sm toothline-text">Service Needed *</label>
            <select name="serviceId" value={formData.serviceId} onChange={handleChange} className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400 text-sm">
                <option>Select a service</option>
                {services.map((service) => (
                    <option key={service.id} value={service.id}>
                    {service.name}
                    </option>
                ))}
            </select>
            <ErrorText field="serviceId" errors={formErrors} />
        </div>

        <div className="my-5">
            <label className="text-sm toothline-text">Additional Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400 text-sm" placeholder="Type here..." />
        </div>

        <div className="my-5">
            <button type="button" 
                onClick={handleSubmit}
                className="toothline-accent hover:toothline-accent-hover text-white rounded-md w-full py-2 transition ease-in-out duration-300"
                disabled={status === 'loading'}
                >{status === 'loading' ? 'Sending...' : 'Submit Appointment Request'}</button>
            {status === 'success' && <p className="mt-3 text-green-600">Form submitted successfully!</p>}
            {status === 'error' && <p className=" text-sm mt-3 text-red-600">Error: {errorMessage}</p>}
        </div>
    </div>
  );
}

export default BookingForm;
