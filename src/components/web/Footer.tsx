import { MapPin, Phone, Send } from 'lucide-react';
function Footer() {
  return (
    <footer className="w-full toothline-accent p-5 text-white">
        <div className="max-w-6xl grid md:grid-cols-3 grid-cols-1 gap-3 mx-auto py-5">
            <div className="my-3 md:my-0">
                <p className="font-bold tracking-wider text-sm">Toothline</p>
                <p className="my-3 text-sm">Providing exceptional dental care with the latest technology and compassionate service.</p>
            </div>
            <div className="my-3 md:my-0">
                <p className="font-bold tracking-wider text-sm">Contact Us</p>
                <p className="mt-3 mb-2 text-sm flex"><Phone size={14} className="my-auto mr-3" />(555) 123-4567</p>
                <p className="my-2 text-sm flex"><Send size={14} className="my-auto mr-3" />info@toothline.com</p>
                <p className="my-2 text-sm flex"><MapPin size={14} className="my-auto mr-3" />123 Dental Ave, Health City</p>
            </div>
            <div className="my-3 md:my-0">
                <p className="font-bold tracking-wider text-sm">Clinic Hours</p>
                <p className="mt-3 mb-2 text-sm">Monday-Friday: 8:00 AM - 6:00 PM</p>
                <p className="my-2 text-sm">Saturday: 9:00 AM - 2:00 PM</p>
                <p className="my-2 text-sm">Emergency services available 24/7</p>
            </div>
        </div>
        <div className="max-w-6xl mx-auto">
            <hr className="my-3 border-gray-300" />
            <p className="pt-2 text-sm text-center">© 2025 KJM - Toothline. All rights reserved.</p>
        </div>
    </footer>
  );
}

export default Footer;
