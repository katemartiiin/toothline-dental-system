import { useEffect, useState } from 'react';
import { fetchPatients, createPatient, updatePatient, archivePatient, 
  type PatientForm, type PatientFilters } from '../../api/patients';
import { type FieldError } from '../../utils/toastMessage';
import Modal from '../../components/Modal';
import ErrorText from '../../components/ErrorText';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { type PageOptions } from '../../utils/paginate';
interface Patient {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}
const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  
  const defaultPatientForm = {
    name: '',
    email: '',
    phoneNumber: ''
  }

  const [patientForm, setPatientForm] = useState<PatientForm>(defaultPatientForm);

  const [patientFilters, setPatientFilters] = useState<PatientFilters>({
      name: "",
      page: 0,
      size: 10
  });

  const [pageOptions, setPageOptions] = useState<PageOptions>({
    first: true,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  const [selectedPatient, setSelectedPatient] = useState<Patient>({
      id: 0,
      name: '',
      email: '',
      phoneNumber: ''
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement >) => {
    const { name, value } = e.target;
    setPatientForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormUpdate = (e: React.ChangeEvent<HTMLInputElement >) => {
    const { name, value } = e.target;
    setSelectedPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectedPatient = (patient: Patient, type: string) => {
      setFormErrors([]);
      setSelectedPatient(patient);
      
      type == 'update' ? setOpenEdit(true) : setOpenDelete(true);
  };

  const handleChangePage = (type: string) => {
    const newPage = type == 'next' ? patientFilters.page + 1 : patientFilters.page - 1;

    setPatientFilters({
      name: patientFilters.name,
      page: newPage,
      size: patientFilters.size
    })
  }
  
  const getPatients = async () => {
    try {
      const res = await fetchPatients(patientFilters);
      setPatients(res.content);
      setPageOptions({
        first: res.first,
        last: res.last,
        number: res.number,
        numberOfElements: res.numberOfElements,
        size: res.size,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      });
    } catch (error) {
      console.error('Failed to fetch patients', error);
    }
  };

  const createNewPatient = async () => {
      const createResponse = await createPatient(patientForm);
      
      if (createResponse.status == 400) {
        setFormErrors(createResponse.errors);
      } else {
        setPatientForm(defaultPatientForm);
        getPatients();
      }
  };
  
  const editPatient = async () => {
    const updateResponse = await updatePatient(selectedPatient.id, selectedPatient);
    
    if (updateResponse.status == 400) {
      setFormErrors(updateResponse.errors);
    } else {
      getPatients();
      setOpenEdit(false);
    }
  };
  
  const archivePt = async (isArchive: boolean) => {
    const archiveResponse = await archivePatient(selectedPatient.id, isArchive);
    
    if (archiveResponse?.status == 200) {
      getPatients();
      setOpenDelete(false);
    }
  };

  useEffect(() => {
    getPatients();
  }, [patientFilters]);

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
          <input type="text" name="name" value={patientFilters.name} onChange={handleFilterChange} className="rounded-md text-sm" placeholder="e.g., Jane Doe" />
        </div>

        {/* Create Patient */}
        <Modal
          isOpen={openCreate}
          title="Create New Patient"
          onClose={() => setOpenCreate(false)}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Patient Name</label>
                  <input type="text" id="name" name="name" value={patientForm.name} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                  <ErrorText field="name" errors={formErrors} />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Email</label>
                  <input type="email" id="email" name="email" value={patientForm.email} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., janedoe@example.com" />
                  <ErrorText field="email" errors={formErrors} />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Phone Number</label>
                  <input type="text" id="phoneNumber" name="phoneNumber" value={patientForm.phoneNumber} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., 09123456789" />
                  <ErrorText field="phoneNumber" errors={formErrors} />
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
                  onClick={() => createNewPatient()}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Save Patient
                </button>
              </div>
            </div>
        </Modal>

        {/* Edit Patient */}
        <Modal
          isOpen={openEdit}
          title="Edit Patient"
          onClose={() => setOpenEdit(false)}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Patient Name</label>
                  <input type="text" id="patientName" name="name" value={selectedPatient.name} onChange={handleFormUpdate} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                  <ErrorText field="name" errors={formErrors} />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Email</label>
                  <input type="email" id="patientEmail" name="email" value={selectedPatient.email} onChange={handleFormUpdate} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., janedoe@example.com" />
                  <ErrorText field="email" errors={formErrors} />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Phone Number</label>
                  <input type="text" id="patientPhoneNumber" name="phoneNumber" value={selectedPatient.phoneNumber} onChange={handleFormUpdate} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., 09123456789" />
                  <ErrorText field="phoneNumber" errors={formErrors} />
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
                  onClick={()=> editPatient()}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Update Patient
                </button>
              </div>
            </div>
        </Modal>

        {/* Archive Patient */}
        <Modal
          isOpen={openDelete}
          title="Archive Patient"
          onClose={() => setOpenDelete(false)}
          >Are you sure you want to archive this patient?
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
              onClick={() => archivePt(true)}
              className="px-4 py-2 toothline-bg-error text-white rounded hover:bg-red-600"
            >
              Archive Patient
            </button>
          </div>
        </Modal>

      </div>
      {/* Table */}
      <div className="w-full flex flex-wrap px-10 py-5 bg-white rounded-lg shadow-md my-5">
        <h2 className="fw-600 text-xl mb-5">Patient Records</h2>

        {/* Table Headers */}
        <div className="w-full grid grid-cols-4 gap-2 px-3 py-2 toothline-bg-light border-b border-gray-200 text-xs toothline-text">
          <p>PATIENT</p>
          <p>EMAIL</p>
          <p>CONTACT NO.</p>
          <p>ACTIONS</p>
        </div>

        {/* Table Rows */}
        {patients?.length ? (
          patients.map((patient) => (
          <div key={patient.id} className="w-full grid grid-cols-4 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
            <p>{patient.name}</p>
            <p>{patient.email}</p>
            <p>{patient.phoneNumber}</p>
            <div className="space-x-3">
              <button type="button" onClick={() => handleSelectedPatient(patient, 'update')} className="toothline-text-accent fw-500">Edit</button>
              <button type="button" onClick={() => handleSelectedPatient(patient, 'archive')} className="toothline-error fw-500">Archive</button>
            </div>
          </div>
          ))
        ) : (
          <p className="w-full bg-gray-50 my-1 p-1 text-gray-500 italic text-center">No patients added yet.</p>
        )}

        {/* Pagination */}
        <div className="w-full flex justify-end toothline-bg-light border border-gray-200 p-3 my-1 text-sm space-x-7">
          <span className="my-auto">{ pageOptions.totalElements } total entries</span>
          <div>
            <span className="my-auto mx-2">Show</span>
            <select id="size" name="size" value={patientFilters.size} onChange={handleFilterChange} className="rounded-md text-sm">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
            </select>
          </div>
          <button type="button" onClick={() => handleChangePage('prev')} disabled={pageOptions.first} className={`flex p-1 ${
                pageOptions.first ? 'text-gray-400' : 'hover:toothline-text-primary'
              }`}>
            <ArrowLeft size={25} className="my-auto" />
            <span className="mx-1 my-auto">Previous</span>
          </button>
          <button type="button" onClick={() => handleChangePage('next')} disabled={pageOptions.last} className={`flex p-1 ${
                pageOptions.last ? 'text-gray-400' : 'hover:toothline-text-primary'
              }`}>
            <span className="mx-1 my-auto">Next</span>
            <ArrowRight size={25} className="my-auto" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default PatientsPage;
