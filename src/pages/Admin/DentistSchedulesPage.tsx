import { useState } from 'react';
import Modal from '../../components/Modal';
import { Pencil, Trash } from 'lucide-react';
const DentistSchedulesPage: React.FC = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedEdit, setCheckedEdit] = useState(false);
  return (
    <div className="w-full flex flex-wrap px-16 py-2">
      <div className="w-full flex flex-wrap">
        <div className="w-1/2 text-sm">
          <label className="text-sm fw-500 toothline-text">Select Dentist: </label>
          <select id="dentist" name="dentist" className="rounded-md text-sm">
              <option value="">Select Dentist</option>
              <option value="Dr. Melissa Chen">Dr. Melissa Chen</option>
              <option value="Dr. James Wilson">Dr. James Wilson</option>
              <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
          </select>
        </div>

        <div className="w-1/2 text-sm text-right">
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 toothline-accent text-white rounded hover:toothline-primary"
          >
            + Add New Schedule
          </button>
        </div>

        {/* Create Schedule */}
        <Modal
          isOpen={openCreate}
          title="Create New Schedule"
          confirmText="Create Schedule"
          cancelText="Cancel"
          onClose={() => setOpenCreate(false)}
          onConfirm={() => {
              console.log('Schedule created!');
            }}
          >
            <div>
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
                  <label className="block text-sm fw-500 toothline-text">Day</label>
                  <select id="day" name="day" className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                  </select>
              </div>
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                  <span className="text-gray-700">All Day</span>
                </label>
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Start Time</label>
                  <input type="time" id="startTime" name="startTime" className="mt-1 block w-full rounded-md text-sm" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">End Time</label>
                  <input type="time" id="endTime" name="endTime" className="mt-1 block w-full rounded-md text-sm" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Status</label>
                  <select id="status" name="status" className="mt-1 block w-full rounded-md text-sm">
                      <option value="available">Available</option>
                      <option value="break">Break</option>
                      <option value="break">Unavailable</option>
                  </select>
              </div>
            </div>
        </Modal>

        {/* Edit Schedule */}
        <Modal
          isOpen={openEdit}
          title="Edit Schedule"
          confirmText="Save changes"
          cancelText="Cancel"
          onClose={() => setOpenEdit(false)}
          onConfirm={() => {
              console.log('Schedule updated!');
            }}
          >
            <div>
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
                  <label className="block text-sm fw-500 toothline-text">Day</label>
                  <select id="day" name="day" className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                  </select>
              </div>
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    checked={checkedEdit}
                    onChange={(e) => setCheckedEdit(e.target.checked)}
                  />
                  <span className="text-gray-700">All Day</span>
                </label>
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Start Time</label>
                  <input type="time" id="startTime" name="startTime" className="mt-1 block w-full rounded-md text-sm" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">End Time</label>
                  <input type="time" id="endTime" name="endTime" className="mt-1 block w-full rounded-md text-sm" />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Status</label>
                  <select id="status" name="status" className="mt-1 block w-full rounded-md text-sm">
                      <option value="available">Available</option>
                      <option value="break">Break</option>
                      <option value="break">Unavailable</option>
                  </select>
              </div>
            </div>
        </Modal>

        {/* Delete Schedule */}
        <Modal
          isOpen={openDelete}
          title="Delete Schedule"
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onClose={() => setOpenDelete(false)}
          onConfirm={() => {
              console.log('Schedule deleted!');
            }}
          >Are you sure you want to delete this schedule? This action cannot be undone.
        </Modal>

      </div>
      {/* Table */}
      <div className="w-full flex flex-wrap px-10 py-5 bg-white rounded-lg shadow-md my-5">
        <h2 className="fw-600 text-xl mb-5">Schedule for Dr. Melissa Chen</h2>
        
        {/* Days */}
        <div className="w-full grid grid-cols-3 gap-3">
            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Monday</p>

              {/* Schedules */}
              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">09:00 AM - 01:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" onClick={() => setOpenEdit(true)} className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" onClick={() => setOpenDelete(true)} className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>

              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">01:00 PM - 02:00 PM</p>
                <p className="toothline-error fw-500 my-auto bg-red-100 rounded text-center">Break</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>

              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">02:00 PM - 06:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Tuesday</p>

              {/* Schedules */}
              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">09:00 AM - 01:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>

              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">01:00 PM - 02:00 PM</p>
                <p className="toothline-error fw-500 my-auto bg-red-100 rounded text-center">Break</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>

              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">02:00 PM - 06:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Wednesday</p>

              {/* Schedules */}
              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">09:00 AM - 01:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>

              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">01:00 PM - 02:00 PM</p>
                <p className="toothline-error fw-500 my-auto bg-red-100 rounded text-center">Break</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>

              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">02:00 PM - 06:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Thursday</p>

              {/* Schedules */}
              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">09:00 AM - 01:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>

              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">02:00 PM - 06:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Friday</p>

              {/* Schedules */}
              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">09:00 AM - 01:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>

              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">01:00 PM - 02:00 PM</p>
                <p className="toothline-error fw-500 my-auto bg-red-100 rounded text-center">Break</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>

              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">02:00 PM - 05:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Saturday</p>

              {/* Schedules */}
              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">09:00 AM - 01:00 PM</p>
                <p className="toothline-success fw-500 my-auto bg-green-100 rounded text-center">Available</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Sunday</p>

              {/* Schedules */}
              <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                <p className="col-span-2 my-auto">All Day</p>
                <p className="toothline-error fw-500 my-auto bg-red-100 rounded text-center">Unavailable</p>
                <div className="flex space-x-2 justify-end">
                  <button type="button" className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                  <button type="button" className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                </div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DentistSchedulesPage;
