const DashboardPage: React.FC = () => {
  return (
    <div className="w-full flex flex-wrap px-16 py-2">

      {/* Cards */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
          <div className="w-full md:w-1/2 h-24">
            <h4 className="fw-500 toothline-text">Today's Appointment</h4>
            <p className="text-2xl fw-700 my-2">12</p>
          </div>
          <div className="w-1/2">
            <span className="float-right">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3eb8c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-days-icon lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            </span>
          </div>
        </div>

        <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
          <div className="w-full md:w-1/2 h-24">
            <h4 className="fw-500 toothline-text">Total Patients</h4>
            <p className="text-2xl fw-700 my-2">1,234</p>
          </div>
          <div className="w-1/2">
            <span className="float-right">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3eb8c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-users-round-icon lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
            </span>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="w-full flex flex-wrap p-10 bg-white rounded-lg shadow-md my-5">
        <h2 className="fw-600 text-xl mb-5">Today's Appointments</h2>

        {/* Table Headers */}
        <div className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light border-b border-gray-200 text-xs toothline-text">
          <p>PATIENT</p>
          <p>TIME</p>
          <p>SERVICE</p>
          <p>DENTIST</p>
          <p>STATUS</p>
          <p>ACTIONS</p>
        </div>

        {/* Table Rows */}
        <div className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>John Smith</p>
          <p>09:00 AM</p>
          <p>Dental Checkup</p>
          <p>Dr. Melissa Chen</p>
          <p className="fw-500 toothline-success">Confirmed</p>
          <p className="fw-500 toothline-text-accent">View<span className="toothline-error ml-3">Check-in</span></p>
        </div>

        <div className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Sarah Johnson</p>
          <p>10:30 AM</p>
          <p>Teeth Cleaning</p>
          <p>Dr. James Wilson</p>
          <p className="fw-500 toothline-text-primary">In Progress</p>
          <p className="fw-500 toothline-text-accent">View<span className="toothline-success ml-3">Complete</span></p>
        </div>

        <div className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Robert Garcia</p>
          <p>11:45 AM</p>
          <p>Tooth Filling</p>
          <p>Dr. Sarag Wilson</p>
          <p className="fw-500 toothline-error">Pending</p>
          <p className="fw-500 toothline-text-accent">View<span className="toothline-success ml-3">Confirm</span></p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
