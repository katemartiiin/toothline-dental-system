import { useState } from 'react';
import Modal from '../../components/Modal';
const AppointmentsPage: React.FC = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  return (
    <div className="w-full flex flex-wrap px-16 py-2">
      <div className="w-full flex flex-wrap">
        <div className="w-1/2 text-sm">
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 toothline-accent text-white rounded hover:toothline-primary"
          >
            + Add New Appointment
          </button>
        </div>

        <div className="w-1/2 grid grid-cols-3 gap-3 text-sm">
          <input type="date" className="rounded-md text-sm" />
          <select id="serviceType" name="serviceType" className="rounded-md text-sm">
              <option value="">Select Service</option>
              <option value="Dental Checkup">Dental Checkup</option>
              <option value="Teeth Cleaning">Teeth Cleaning</option>
              <option value="Tooth Filling">Tooth Filling</option>
              <option value="Root Canal">Root Canal</option>
              <option value="Extraction">Extraction</option>
          </select>
          <input type="text" className="rounded-md text-sm" placeholder="e.g., Jane Doe" />
        </div>

        {/* Create Appointment */}
        <Modal
          isOpen={openCreate}
          title="Create New Appointment"
          confirmText="Create Appointment"
          cancelText="Cancel"
          onClose={() => setOpenCreate(false)}
          onConfirm={() => {
              console.log('Appointment created!');
            }}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Patient Name</label>
                  <input type="text" id="patientName" name="patientName" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Date</label>
                  <input type="date" id="appointmentDate" name="appointmentDate" className="mt-1 block w-full rounded-md text-sm" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Time</label>
                  <input type="time" id="appointmentTime" name="appointmentTime" className="mt-1 block w-full rounded-md text-sm" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Service</label>
                  <select id="serviceType" name="serviceType" className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select Service</option>
                      <option value="Dental Checkup">Dental Checkup</option>
                      <option value="Teeth Cleaning">Teeth Cleaning</option>
                      <option value="Tooth Filling">Tooth Filling</option>
                      <option value="Root Canal">Root Canal</option>
                      <option value="Extraction">Extraction</option>
                  </select>
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Dentist</label>
                  <select id="dentist" name="dentist" className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select Dentist</option>
                      <option value="Dr. Melissa Chen">Dr. Melissa Chen</option>
                      <option value="Dr. James Wilson">Dr. James Wilson</option>
                      <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                  </select>
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Status</label>
                  <select id="status" name="status" className="mt-1 block w-full rounded-md text-sm">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                  </select>
              </div>
            </div>
        </Modal>

        {/* Edit Appointment */}
        <Modal
          isOpen={openEdit}
          title="Edit Appointment"
          confirmText="Save changes"
          cancelText="Cancel"
          onClose={() => setOpenEdit(false)}
          onConfirm={() => {
              console.log('Appointment updated!');
            }}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Patient Name</label>
                  <input type="text" id="patientName" name="patientName" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Date</label>
                  <input type="date" id="appointmentDate" name="appointmentDate" className="mt-1 block w-full rounded-md text-sm" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Time</label>
                  <input type="time" id="appointmentTime" name="appointmentTime" className="mt-1 block w-full rounded-md text-sm" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Service</label>
                  <select id="serviceType" name="serviceType" className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select Service</option>
                      <option value="Dental Checkup">Dental Checkup</option>
                      <option value="Teeth Cleaning">Teeth Cleaning</option>
                      <option value="Tooth Filling">Tooth Filling</option>
                      <option value="Root Canal">Root Canal</option>
                      <option value="Extraction">Extraction</option>
                  </select>
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Dentist</label>
                  <select id="dentist" name="dentist" className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select Dentist</option>
                      <option value="Dr. Melissa Chen">Dr. Melissa Chen</option>
                      <option value="Dr. James Wilson">Dr. James Wilson</option>
                      <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                  </select>
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Status</label>
                  <select id="status" name="status" className="mt-1 block w-full rounded-md text-sm">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                  </select>
              </div>
            </div>
        </Modal>

      </div>
      {/* Table */}
      <div className="w-full flex flex-wrap px-10 py-5 bg-white rounded-lg shadow-md my-5">
        <h2 className="fw-600 text-xl mb-5">All Appointments</h2>

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
          <div>
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <span className="toothline-error ml-3">Check-in</span>
          </div>
        </div>

        <div className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Sarah Johnson</p>
          <p>10:30 AM</p>
          <p>Teeth Cleaning</p>
          <p>Dr. James Wilson</p>
          <p className="fw-500 toothline-text-primary">In Progress</p>
          <div>
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <span className="toothline-success ml-3 fw-500">Complete</span>
          </div>
        </div>

        <div className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Robert Garcia</p>
          <p>11:45 AM</p>
          <p>Tooth Filling</p>
          <p>Dr. Sarah Wilson</p>
          <p className="fw-500 toothline-error">Pending</p>
          <div>
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <span className="toothline-success ml-3 fw-500">Confirm</span>
          </div>
        </div>

        <div className="w-full grid grid-cols-6 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Emily White</p>
          <p>02:00 PM</p>
          <p>Root Canal</p>
          <p>Dr. Melissa Chen</p>
          <p className="fw-500 toothline-error">Canceled</p>
          <div>
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <span className="toothline-error ml-3">Archive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
