function BookingForm() {
  return (
    <div className="max-w-2xl bg-white rounded-lg shadow-md p-7 mx-5 md:mx-auto mb-3">
        <h3 className="font-bold font-montserrat text-2xl mb-5">Book Your Appointment</h3>

        <div className="my-5">
            <label className="text-sm toothline-text">Full Name *</label>
            <input type="text" className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400" placeholder="Enter your full name" />
        </div>

        <div className="my-5">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div>
                    <label className="text-sm toothline-text">Email *</label>
                    <input type="text" className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400" placeholder="Enter your email" />
                </div>
                <div>
                    <label className="text-sm toothline-text">Phone Number *</label>
                    <input type="text" className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400" placeholder="Enter your phone" />
                </div>
            </div>
        </div>

        <div className="my-5">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div>
                    <label className="text-sm toothline-text">Preferred Date *</label>
                    <input type="date" className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400" />
                </div>
                <div>
                    <label className="text-sm toothline-text">Preferred Time *</label>
                    <input type="time" className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400" />
                </div>
            </div>
        </div>

        <div className="my-5">
            <label className="text-sm toothline-text">Service Needed *</label>
            <select className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400 text-sm">
                <option>Select a service</option>
            </select>
        </div>

        <div className="my-5">
            <label className="text-sm toothline-text">Additional Notes</label>
            <textarea className="w-full my-1 bg-gray-100 px-3 py-2 rounded-md border border-gray-400 text-sm" placeholder="Type here..." />
        </div>

        <div className="my-5">
            <button type="button" className="toothline-accent hover:toothline-accent-hover text-white rounded-md w-full py-2 transition ease-in-out duration-300">Submit Appointment Request</button>
        </div>
    </div>
  );
}

export default BookingForm;
