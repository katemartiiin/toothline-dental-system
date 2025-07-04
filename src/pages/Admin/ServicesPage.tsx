import { useState } from 'react';
import Modal from '../../components/Modal';
const ServicesPage: React.FC = () => {
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
            + Add New Service
          </button>
        </div>

        <div className="w-1/2 grid grid-cols-3 gap-3 text-sm">
          <select className="mt-1 block w-full rounded-md text-sm">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
          </select>
          <input type="text" className="col-span-2 rounded-md text-sm" placeholder="e.g., Tooth Filling" />
        </div>

        {/* Create Service */}
        <Modal
          isOpen={openCreate}
          title="Create New Service"
          confirmText="Create Service"
          cancelText="Cancel"
          onClose={() => setOpenCreate(false)}
          onConfirm={() => {
              console.log('Service created!');
            }}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Service Name</label>
                  <input type="text" id="patientName" name="patientName" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Description</label>
                  <textarea id="serviceDescription" name="serviceDescription" className="mt-1 block w-full rounded-md text-sm" placeholder="Brief description of the service"></textarea>
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Price ($)</label>
                  <input type="number" id="servicePrice" name="servicePrice" className="mt-1 block w-full rounded-md text-sm" step="0.01" min="0" placeholder="e.g., 250.00" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Duration</label>
                  <input type="number" id="serviceDuration" name="serviceDuration" className="mt-1 block w-full rounded-md text-sm" min="1" placeholder="e.g., 60" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Status</label>
                  <select id="status" name="status" className="mt-1 block w-full rounded-md text-sm">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                  </select>
              </div>
            </div>
        </Modal>

        {/* Edit Service */}
        <Modal
          isOpen={openEdit}
          title="Edit Service"
          confirmText="Save changes"
          cancelText="Cancel"
          onClose={() => setOpenEdit(false)}
          onConfirm={() => {
              console.log('Service updated!');
            }}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Service Name</label>
                  <input type="text" id="patientName" name="patientName" className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Description</label>
                  <textarea id="serviceDescription" name="serviceDescription" className="mt-1 block w-full rounded-md text-sm" placeholder="Brief description of the service"></textarea>
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Price ($)</label>
                  <input type="number" id="servicePrice" name="servicePrice" className="mt-1 block w-full rounded-md text-sm" step="0.01" min="0" placeholder="e.g., 250.00" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Duration</label>
                  <input type="number" id="serviceDuration" name="serviceDuration" className="mt-1 block w-full rounded-md text-sm" min="1" placeholder="e.g., 60" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Status</label>
                  <select id="status" name="status" className="mt-1 block w-full rounded-md text-sm">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                  </select>
              </div>
            </div>
        </Modal>

        {/* Delete Schedule */}
        <Modal
          isOpen={openDelete}
          title="Delete Service"
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onClose={() => setOpenDelete(false)}
          onConfirm={() => {
              console.log('Service deleted!');
            }}
          >Are you sure you want to delete this service? This action cannot be undone.
        </Modal>

      </div>
      {/* Table */}
      <div className="w-full flex flex-wrap px-10 py-5 bg-white rounded-lg shadow-md my-5">
        <h2 className="fw-600 text-xl mb-5">Clinic Services</h2>

        {/* Table Headers */}
        <div className="w-full grid grid-cols-8 gap-2 px-3 py-2 toothline-bg-light border-b border-gray-200 text-xs toothline-text">
          <p className="col-span-2">SERVICE NAME</p>
          <p className="col-span-2">DESCRIPTION</p>
          <p>PRICE</p>
          <p>DURATION</p>
          <p>STATUS</p>
          <p>ACTIONS</p>
        </div>

        {/* Table Rows */}
        <div className="w-full grid grid-cols-8 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p className="col-span-2">Dental Checkup</p>
          <p className="col-span-2 truncate">Comprehensive oral examination</p>
          <p>$75.00</p>
          <p>30</p>
          <p className="fw-500 toothline-success">Active</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <button type="button" onClick={() => setOpenDelete(true)} className="toothline-error fw-500">Delete</button>
          </div>
        </div>

        <div className="w-full grid grid-cols-8 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p className="col-span-2">Teeth Cleaning</p>
          <p className="col-span-2 truncate">Professional scaling and polishing</p>
          <p>$120.00</p>
          <p>45</p>
          <p className="fw-500 toothline-success">Active</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <button type="button" onClick={() => setOpenDelete(true)} className="toothline-error fw-500">Delete</button>
          </div>
        </div>

        <div className="w-full grid grid-cols-8 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p className="col-span-2">Tooth Filling</p>
          <p className="col-span-2 truncate">Restoration of teeth damanged by</p>
          <p>$150.00</p>
          <p>60</p>
          <p className="fw-500 toothline-success">Active</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <button type="button" onClick={() => setOpenDelete(true)} className="toothline-error fw-500">Delete</button>
          </div>
        </div>

        <div className="w-full grid grid-cols-8 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
          <p className="col-span-2">Wisdom Tooth Extraction</p>
          <p className="col-span-2 truncate">Surgical removal of wisdom teeth.</p>
          <p>$150.00</p>
          <p>90</p>
          <p className="fw-500 toothline-error">Inctive</p>
          <div className="space-x-3">
            <button type="button" onClick={() => setOpenEdit(true)} className="toothline-text-accent fw-500">Edit</button>
            <button type="button" onClick={() => setOpenDelete(true)} className="toothline-error fw-500">Delete</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServicesPage;
