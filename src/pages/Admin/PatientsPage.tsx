import { useState } from 'react';
import Modal from '../../components/Modal';
const PatientsPage: React.FC = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  return (
    <div className="w-full flex flex-wrap px-16 py-2">
      <div className="w-full flex flex-wrap">
        <div className="w-1/2 text-sm">
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 toothline-accent text-white rounded hover:toothline-primary"
          >
            + Add New Patient
          </button>
        </div>

        <div className="w-1/2 text-sm flex justify-end">
          <input type="text" className="rounded-md text-sm" placeholder="e.g., Jane Doe" />
        </div>

        {/* Create Patient */}
        <Modal
          isOpen={openCreate}
          title="Create New Patient"
          confirmText="Create Patient"
          cancelText="Cancel"
          onClose={() => setOpenCreate(false)}
          onConfirm={() => {
              console.log('Patient record created!');
            }}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Patient Name</label>
                  <input type="text" id="patientName" name="patientName" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Email</label>
                  <input type="email" id="patientName" name="patientName" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., janedoe@example.com" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Phone Number</label>
                  <input type="text" id="patientName" name="patientName" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., 09123456789" />
              </div>
            </div>
        </Modal>

        {/* Edit Patient */}
        <Modal
          isOpen={openEdit}
          title="Edit Patient"
          confirmText="Save changes"
          cancelText="Cancel"
          onClose={() => setOpenEdit(false)}
          onConfirm={() => {
              console.log('Patient record updated!');
            }}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Patient Name</label>
                  <input type="text" id="patientName" name="patientName" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Email</label>
                  <input type="email" id="patientName" name="patientName" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., janedoe@example.com" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Phone Number</label>
                  <input type="text" id="patientName" name="patientName" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., 09123456789" />
              </div>
            </div>
        </Modal>

        {/* Delete Patient */}
        <Modal
          isOpen={openDelete}
          title="Archive Patient"
          confirmText="Yes, Archive"
          cancelText="Cancel"
          onClose={() => setOpenDelete(false)}
          onConfirm={() => {
              console.log('Patient archived!');
            }}
          >Are you sure you want to delete this patient?
        </Modal>

      </div>
      {/* Table */}
      <div className="w-full flex flex-wrap px-10 py-5 bg-white rounded-lg shadow-md my-5">
        <h2 className="fw-600 text-xl mb-5">Patient Records</h2>

        {/* Table Headers */}
        <div className="w-full grid grid-cols-5 gap-2 px-3 py-2 toothline-bg-light border-b border-gray-200 text-xs toothline-text">
          <p>PATIENT</p>
          <p>PATIENT ID</p>
          <p>CONTACT</p>
          <p>LAST VISIT</p>
          <p>ACTIONS</p>
        </div>

        {/* Table Rows */}
        <div className="w-full grid grid-cols-5 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>John Smith</p>
          <p>PT-1001</p>
          <p>johnsmith@example.com</p>
          <p>2025-06-01</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <button type="button" onClick={() => setOpenDelete(true)} className="toothline-error fw-500">Archive</button>
          </div>
        </div>

        <div className="w-full grid grid-cols-5 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Sarah Johnson</p>
          <p>PT-1002</p>
          <p>sarah.j@example.com</p>
          <p>2025-06-01</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <button type="button" onClick={() => setOpenDelete(true)} className="toothline-error fw-500">Archive</button>
          </div>
        </div>

        <div className="w-full grid grid-cols-5 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Robert Garcia</p>
          <p>PT-1003</p>
          <p>robert.g@example.com</p>
          <p>2025-06-01</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <button type="button" onClick={() => setOpenDelete(true)} className="toothline-error fw-500">Archive</button>
          </div>
        </div>

        <div className="w-full grid grid-cols-5 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p>Emily White</p>
          <p>PT-1004</p>
          <p>emily.w@example.com</p>
          <p>2025-06-01</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <button type="button" onClick={() => setOpenDelete(true)} className="toothline-error fw-500">Archive</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;
