import { Ambulance, Baby, ClipboardPlus, Component, Hammer, SquareActivity } from 'lucide-react';
function Services() {
  return (
    <div className="max-w-6xl mx-auto p-5 my-10">
        <div className="text-center py-10">
            <h3 className="text-4xl font-bold font-montserrat mb-5">Our Dental Services</h3>
            <p className="toothline-text text-2xl">Comprehensive care for your oral needs</p>
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-3 md:gap-5 pb-10 mb-5">
            <div className="grid grid-cols-3 gap-1 toothline-bg-light px-5 py-7 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <ClipboardPlus size={55} className="m-auto toothline-secondary p-2 rounded-md toothline-text-accent" />
                <div className="col-span-2">
                    <p className="mb-3 font-semibold">General Dentistry</p>
                    <p className="text-xs toothline-text">Routine checkups, cleanings, fillings, and preventive care.</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 toothline-bg-light px-5 py-7 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <Component size={55} className="m-auto toothline-secondary p-2 rounded-md toothline-text-accent" />
                <div className="col-span-2">
                    <p className="mb-3 font-semibold">Cosmetic Dentistry</p>
                    <p className="text-xs toothline-text">Teeth whitening, veneers, and smile makeovers.</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 toothline-bg-light px-5 py-7 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <Hammer size={55} className="m-auto toothline-secondary p-2 rounded-md toothline-text-accent" />
                <div className="col-span-2">
                    <p className="mb-3 font-semibold">Orthodontics</p>
                    <p className="text-xs toothline-text">Braces and aligners to straighten teeth.</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 toothline-bg-light px-5 py-7 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <SquareActivity size={55} className="m-auto toothline-secondary p-2 rounded-md toothline-text-accent" />
                <div className="col-span-2">
                    <p className="mb-3 font-semibold">Oral Surgery</p>
                    <p className="text-xs toothline-text">Tooth extractions and implants.</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 toothline-bg-light px-5 py-7 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <Baby size={55} className="m-auto toothline-secondary p-2 rounded-md toothline-text-accent" />
                <div className="col-span-2">
                    <p className="mb-3 font-semibold">Pediatric Dentistry</p>
                    <p className="text-xs toothline-text">Specialized care for children.</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 toothline-bg-light px-5 py-7 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <Ambulance size={55} className="m-auto toothline-secondary p-2 rounded-md toothline-text-accent" />
                <div className="col-span-2">
                    <p className="mb-3 font-semibold">Emergency Care</p>
                    <p className="text-xs toothline-text">Immediate treatment for dental emergencies.</p>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Services;
