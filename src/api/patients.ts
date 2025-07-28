import axios from '../lib/axios';

export interface PatientFilters {
  name?: string;
};

export interface PatientForm {
  name: string;
  email: string;
  phoneNumber: string;
}

export const fetchPatients = async (filters: PatientFilters) => {
  const res = await axios.post('/admin/patients/fetch-all', filters);
  return res.data.data;
};

export const createPatient = async (patientForm: PatientForm) => {
  const res = await axios.post('/admin/patients', patientForm)
  return res.data;
}

export const updatePatient = async (patientId: number, patientForm: PatientForm) => {
  const res = await axios.put('/admin/patients/' + patientId + '/update', patientForm);
  return res.data;
}

export const archivePatient = async (patientId: number, isArchive: boolean) => {
  const res = await axios.put('/admin/patients/' + patientId + '/archive', null, {
    params: {archived: isArchive }
  });
  return res.data;
}