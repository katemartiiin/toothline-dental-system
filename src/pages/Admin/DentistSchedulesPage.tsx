import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import ErrorText from '../../components/ErrorText';
import { Pencil, Trash } from 'lucide-react';
import { fetchSchedules, fetchMySchedules, createSchedule, createMySchedule, updateSchedule, deleteSchedule,
  type DentistSchedule, type ScheduleForm, type UpdateScheduleForm, type ScheduleDay, scheduleDays } from '../../api/schedules';
import { fetchUsersByRole, type UsersFilters } from '../../api/users';
import { type FieldError } from '../../utils/toastMessage';
interface Dentist {
  id: number;
  email: string;
  name: string;
  role: string;
}
type GroupedSchedules = Record<ScheduleDay, DentistSchedule[]>;
const DentistSchedulesPage: React.FC = () => {
  const { userName, userRole } = useAuth();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);

  const defaultScheduleForm = {
    dentistId: '',
    schedDay: null,
    startTime: '',
    endTime: '',
    status: 'AVAILABLE',
  }

  const defaultUpdateSchedForm = {
    id: '',
    schedDay: '',
    startTime: '',
    endTime: '',
    status: 'AVAILABLE',
  }

  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>(defaultScheduleForm);
  const [updateSchedForm, setUpdateScheduleForm] = useState<UpdateScheduleForm>(defaultUpdateSchedForm);

  const [schedules, setSchedules] = useState<GroupedSchedules | null>(null);

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [userFilters, setUserFilters] = useState<UsersFilters>({
    role: ""
  });
  const [selectedDentist, setSelectedDentist] = useState<Dentist | any>({
    id: 0,
    email: '',
    name: '',
    role: ''
  });

  const selectedSchedId = useRef(null)
  const selectedSchedule = useRef(defaultUpdateSchedForm);

  const setAndEditSched = (sched: any, isOpen: boolean) => {
    setFormErrors([]);
    selectedSchedule.current = sched;
    setUpdateScheduleForm({
      id: sched.id,
      schedDay: sched.schedDay,
      startTime: sched.startTime,
      endTime: sched.endTime,
      status: sched.status
    })
    setOpenEdit(isOpen);
  }

  const fetchDentistSchedules = async (dentistId: number | null) => {
    try {
      const res = userRole == 'DENTIST' ? await fetchMySchedules() : await fetchSchedules(dentistId);
      setSchedules(res);
    } catch (err) {
      console.error('Failed to fetch dentist schedule: ' + err);
    }
  };

  const handleScheduleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement >) => {
    const { name, value } = e.target;
    setScheduleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSchedFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement >) => {
    const { name, value } = e.target;
    setUpdateScheduleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDentistChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    const dentist = dentists.find(d => d.id === selectedId) || null;
    setSelectedDentist(dentist);
    if (selectedId != 0) {
      fetchDentistSchedules(selectedId);
    } else {
      setSchedules(null);
    }
  };

  const handleDeleteSched = (scheduleId: number | any) => {
    selectedSchedId.current = scheduleId;
    setOpenDelete(true);
  };

  const getDentists = async () => {
    try {
      userFilters.role = "DENTIST";
      const dataDentists = await fetchUsersByRole(userFilters);
      setDentists(dataDentists);
    } catch (error) {
      console.error('Failed to fetch dentists', error);
    }
  }

  const deleteDentistSched = async () => {
    const deleteResponse = await deleteSchedule(selectedSchedId.current);
    if (deleteResponse?.status == 200) {
      setOpenDelete(false);
      fetchDentistSchedules(selectedDentist?.id);
    }
  };

  const createDentistSched = async () => {
    setFormErrors([]);
    const createResponse = userRole == 'DENTIST' ? await createMySchedule(scheduleForm) : await createSchedule(scheduleForm);
    
    if (createResponse.status == 400) {
      setFormErrors(createResponse.errors);
    } else {
      setScheduleForm(defaultScheduleForm);
      fetchDentistSchedules(selectedDentist?.id);
    }
  }

  const updateDentistSched = async () => {
    setFormErrors([]);
    const updateResponse = await updateSchedule(updateSchedForm);
    
    if (updateResponse.status == 400) {
      setFormErrors(updateResponse.errors);
    } else {
      setUpdateScheduleForm(defaultUpdateSchedForm);
      fetchDentistSchedules(selectedDentist?.id);
    }
  }

  useEffect(() => {
    userRole == 'DENTIST' ? fetchDentistSchedules(null) : getDentists();
  }, []);
  return (
    <div className="w-full flex flex-wrap px-16 py-2">
      <div className="w-full flex flex-wrap">
        <div className="w-1/2 text-sm">
          {userRole != "DENTIST" ? (
            <>
              <label className="text-sm fw-500 toothline-text">Select Dentist: </label>
              <select
                id="dentistId"
                name="dentistId"
                onChange={handleDentistChange}
                value={selectedDentist?.id}
                className="rounded-md text-sm"
              >
                <option value="0">Select Dentist</option>
                {dentists?.length ? (
                  dentists.map((dentist) => (
                    <option key={dentist.id} value={dentist.id}>
                      {dentist.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No Dentist/s yet</option>
                )}
              </select>
            </>
          ) : (
            <>
              <div className="flex">
                <label className="text-sm fw-500 toothline-text">Dentist: </label>
                <p className="mx-2 text-sm">{userName}</p>
              </div>
            </>
          )}
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
          onClose={() => setOpenCreate(false)}
          >
            <div>
              {userRole != 'DENTIST' && (
                <div className="mb-4">
                    <label className="block text-sm fw-500 toothline-text">Dentist</label>
                    <select id="dentistId" name="dentistId" value={scheduleForm.dentistId} onChange={handleScheduleFormChange} className="mt-1 block w-full rounded-md text-sm">
                        <option value="">Select Dentist</option>
                        {dentists?.length ? (
                          dentists.map((dentist) => (
                          <option key={dentist.id} value={dentist.id}>
                          {dentist.name}
                          </option>
                          ))
                        ) : (
                          <option value="" disabled selected>No Dentist/s yet</option>
                        )}
                    </select>
                    <ErrorText field="dentistId" errors={formErrors} />
                </div>
              )}
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Day</label>
                  <select id="schedDay" name="schedDay" value={scheduleForm.schedDay ? scheduleForm.schedDay : ""} onChange={handleScheduleFormChange} className="mt-1 block w-full rounded-md text-sm">
                      <option value="">Select day</option>
                      {scheduleDays.map((day) => (
                        <option key={day} value={day}>
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </option>
                      ))}
                  </select>
                  <ErrorText field="schedDay" errors={formErrors} />
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">Status</label>
                  <select id="status" name="status" value={scheduleForm.status} onChange={handleScheduleFormChange} className="mt-1 block w-full rounded-md text-sm">
                      <option value="AVAILABLE">Available</option>
                      <option value="BREAK">Break</option>
                      <option value="UNAVAILABLE">Unavailable</option>
                  </select>
                  <ErrorText field="status" errors={formErrors} />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Start Time</label>
                  <input type="time" id="startTime" name="startTime" value={scheduleForm.startTime} onChange={handleScheduleFormChange} className="mt-1 block w-full rounded-md text-sm" />
                  <ErrorText field="startTime" errors={formErrors} />
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">End Time</label>
                  <input type="time" id="endTime" name="endTime" value={scheduleForm.endTime} onChange={handleScheduleFormChange} className="mt-1 block w-full rounded-md text-sm" />
                  <ErrorText field="endTime" errors={formErrors} />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => createDentistSched()}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Save Schedule
                </button>
              </div>
            </div>
        </Modal>

        {/* Edit Schedule */}
        <Modal
          isOpen={openEdit}
          title="Edit Schedule"
          onClose={() => setOpenEdit(false)}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">{selectedSchedule.current.schedDay}</label>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Start Time</label>
                  <input type="time" id="startTimeUp" name="startTime" value={updateSchedForm.startTime} onChange={handleUpdateSchedFormChange} className="mt-1 block w-full rounded-md text-sm" />
                  <ErrorText field="startTime" errors={formErrors} />
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">End Time</label>
                  <input type="time" id="endTimeUp" name="endTime" value={updateSchedForm.endTime} onChange={handleUpdateSchedFormChange} className="mt-1 block w-full rounded-md text-sm" />
                  <ErrorText field="endTime" errors={formErrors} />
                </div>
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Status</label>
                  <select id="status" name="status" value={updateSchedForm.status} onChange={handleUpdateSchedFormChange} className="mt-1 block w-full rounded-md text-sm">
                      <option value="AVAILABLE">Available</option>
                      <option value="BREAK">Break</option>
                      <option value="UNAVAILABLE">Unavailable</option>
                  </select>
                  <ErrorText field="status" errors={formErrors} />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpenEdit(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => updateDentistSched()}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Update Schedule
                </button>
              </div>
            </div>
        </Modal>

        {/* Delete Schedule */}
        <Modal
          isOpen={openDelete}
          title="Delete Schedule"
          onClose={() => setOpenDelete(false)}
          >Are you sure you want to delete this schedule? This action cannot be undone.
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setOpenDelete(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleteDentistSched()}
              className="px-4 py-2 toothline-bg-error text-white rounded hover:bg-red-600"
            >
              Delete Schedule
            </button>
          </div>
        </Modal>

      </div>
      {/* Table */}
      <div className="w-full flex flex-wrap px-10 py-5 bg-white rounded-lg shadow-md my-5">
        {userRole != 'DENTIST' ? (
          <><h2 className="fw-600 text-xl mb-5">Schedule for { selectedDentist?.name }</h2></>
        ) : (
          <><h2 className="fw-600 text-xl mb-5">Your Schedule</h2></>
        )}
        
        {/* Days */}
        <div className="w-full grid grid-cols-3 gap-3">
            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Monday</p>

              {/* Monday */}
              {schedules?.MONDAY.length ? (
                schedules.MONDAY.map((mon) => (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-2 my-auto">{mon.startTime} - {mon.endTime}</p>
                  <p className={`fw-500 my-auto rounded text-center ${(mon.status === 'AVAILABLE') ? 'toothline-success bg-green-100'
                    : 'toothline-error bg-red-100' }`}>{mon.status.charAt(0) + mon.status.slice(1).toLowerCase()}</p>
                  <div className="flex space-x-2 justify-end">
                    <button type="button" onClick={() => setAndEditSched(mon, true)} className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                    <button type="button" onClick={() => handleDeleteSched(mon.id)} className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                  </div>
                </div>
                ))
              ) : (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-4 text-center italic text-gray-400">--- No schedule for Monday ---</p>
                </div>
              )}
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Tuesday</p>

              {/* Tuesday */}
              {schedules?.TUESDAY.length ? (
                schedules.TUESDAY.map((tues) => (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-2 my-auto">{tues.startTime} - {tues.endTime}</p>
                  <p className={`fw-500 my-auto rounded text-center ${(tues.status === 'AVAILABLE') ? 'toothline-success bg-green-100'
                    : 'toothline-error bg-red-100' }`}>{tues.status.charAt(0) + tues.status.slice(1).toLowerCase()}</p>
                  <div className="flex space-x-2 justify-end">
                    <button type="button" onClick={() => setAndEditSched(tues, true)} className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                    <button type="button" onClick={() => handleDeleteSched(tues.id)} className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                  </div>
                </div>
                ))
              ) : (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-4 text-center italic text-gray-400">--- No schedule for Tuesday ---</p>
                </div>
              )}
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Wednesday</p>

              {/* Wednesday */}
              {schedules?.WEDNESDAY.length ? (
                schedules.WEDNESDAY.map((wed) => (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-2 my-auto">{wed.startTime} - {wed.endTime}</p>
                  <p className={`fw-500 my-auto rounded text-center ${(wed.status === 'AVAILABLE') ? 'toothline-success bg-green-100'
                    : 'toothline-error bg-red-100' }`}>{wed.status.charAt(0) + wed.status.slice(1).toLowerCase()}</p>
                  <div className="flex space-x-2 justify-end">
                    <button type="button" onClick={() => setAndEditSched(wed, true)} className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                    <button type="button" onClick={() => handleDeleteSched(wed.id)} className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                  </div>
                </div>
                ))
              ) : (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-4 text-center italic text-gray-400">--- No schedule for Wednesday ---</p>
                </div>
              )}
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Thursday</p>

              {/* Thursday */}
              {schedules?.THURSDAY.length ? (
                schedules.THURSDAY.map((thurs) => (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-2 my-auto">{thurs.startTime} - {thurs.endTime}</p>
                  <p className={`fw-500 my-auto rounded text-center ${(thurs.status === 'AVAILABLE') ? 'toothline-success bg-green-100'
                    : 'toothline-error bg-red-100' }`}>{thurs.status.charAt(0) + thurs.status.slice(1).toLowerCase()}</p>
                  <div className="flex space-x-2 justify-end">
                    <button type="button" onClick={() => setAndEditSched(thurs, true)} className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                    <button type="button" onClick={() => handleDeleteSched(thurs.id)} className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                  </div>
                </div>
                ))
              ) : (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-4 text-center italic text-gray-400">--- No schedule for Thursday ---</p>
                </div>
              )}
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Friday</p>

              {/* Friday */}
              {schedules?.FRIDAY.length ? (
                schedules.FRIDAY.map((fri) => (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-2 my-auto">{fri.startTime} - {fri.endTime}</p>
                  <p className={`fw-500 my-auto rounded text-center ${(fri.status === 'AVAILABLE') ? 'toothline-success bg-green-100'
                    : 'toothline-error bg-red-100' }`}>{fri.status.charAt(0) + fri.status.slice(1).toLowerCase()}</p>
                  <div className="flex space-x-2 justify-end">
                    <button type="button" onClick={() => setAndEditSched(fri, true)} className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                    <button type="button" onClick={() => handleDeleteSched(fri.id)} className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                  </div>
                </div>
                ))
              ) : (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-4 text-center italic text-gray-400">--- No schedule for Friday ---</p>
                </div>
              )}
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Saturday</p>

              {/* Saturday */}
              {schedules?.SATURDAY.length ? (
                schedules.SATURDAY.map((sat) => (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-2 my-auto">{sat.startTime} - {sat.endTime}</p>
                  <p className={`fw-500 my-auto rounded text-center ${(sat.status === 'AVAILABLE') ? 'toothline-success bg-green-100'
                    : 'toothline-error bg-red-100' }`}>{sat.status.charAt(0) + sat.status.slice(1).toLowerCase()}</p>
                  <div className="flex space-x-2 justify-end">
                    <button type="button" onClick={() => setAndEditSched(sat, true)} className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                    <button type="button" onClick={() => handleDeleteSched(sat.id)} className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                  </div>
                </div>
                ))
              ) : (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-4 text-center italic text-gray-400">--- No schedule for Saturday ---</p>
                </div>
              )}
            </div>

            <div className="toothline-bg-light p-3 rounded-md shadow text-sm my-2">
              <p className="toothline-text fw-600 mb-5">Sunday</p>

              {/* Sunday */}
              {schedules?.SUNDAY.length ? (
                schedules.SUNDAY.map((sun) => (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-2 my-auto">{sun.startTime} - {sun.endTime}</p>
                  <p className={`fw-500 my-auto rounded text-center ${(sun.status === 'AVAILABLE') ? 'toothline-success bg-green-100'
                    : 'toothline-error bg-red-100' }`}>{sun.status.charAt(0) + sun.status.slice(1).toLowerCase()}</p>
                  <div className="flex space-x-2 justify-end">
                    <button type="button" onClick={() => setAndEditSched(sun, true)} className="toothline-accent hover:toothline-primary p-1 rounded"><Pencil color="White" size={10} /></button>
                    <button type="button" onClick={() => handleDeleteSched(sun.id)} className="toothline-bg-error hover:bg-red-300 p-1 rounded"><Trash color="White" size={10} /></button>
                  </div>
                </div>
                ))
              ) : (
                <div className="w-full grid grid-cols-4 gap-2 text-xs my-3">
                  <p className="col-span-4 text-center italic text-gray-400">--- No schedule for Sunday ---</p>
                </div>
              )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default DentistSchedulesPage;
