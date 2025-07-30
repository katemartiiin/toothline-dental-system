import axios from '../lib/axios';
import { toastError, toastSuccess } from '../utils/toastMessage';

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
  try {
    const res = await axios.post('/admin/patients', patientForm)
    toastSuccess(res.data.message);
    return res.data;

  } catch (error: any) {
    toastError(error.response.data.message);

    if (error.response.data.status == 400) {
      return error.response.data;
    }
  }
}

export const updatePatient = async (patientId: number, patientForm: PatientForm) => {
  try {
    const res = await axios.put('/admin/patients/' + patientId + '/update', patientForm);
    toastSuccess(res.data.message);
    return res.data;
  } catch (error: any) {
    toastError(error.response.data.message);

    if (error.response.data.status == 400) {
      return error.response.data;
    }
  }
}

export const archivePatient = async (patientId: number, isArchive: boolean) => {
  try {
    const res = await axios.put('/admin/patients/' + patientId + '/archive', null, {
      params: {archived: isArchive }
    });
    toastSuccess(res.data.message);
    return res;
  } catch (error: any) {
    toastError(error.response.data.message);
  }
}