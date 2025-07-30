import axios from '../lib/axios';
import { toastError, toastSuccess  } from '../utils/toastMessage';

export type ScheduleDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export const scheduleDays: ScheduleDay[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];
export interface DentistSchedule {
  id: number;
  schedDay: ScheduleDay;
  startTime: string;
  endTime: string;
  status: string;
}

export interface ScheduleForm {
  dentistId: string;
  schedDay: string | null;
  startTime: string;
  endTime: string;
  status: string;
}

export interface UpdateScheduleForm {
  id: string;
  schedDay: string;
  startTime: string;
  endTime: string;
  status: string;
}

export const fetchSchedules = async (dentistId: number | any) => {
  const res = await axios.get('/admin/schedules/' + dentistId + '/fetch');
  return res.data;
};

export const createSchedule = async (scheduleForm : ScheduleForm) => {
  try {
    const res = await axios.post('/admin/schedules', scheduleForm);
    toastSuccess(res.data.message);
    return res.data;

  } catch (error: any) {
    toastError(error.response.data.message);

    if (error.response.data.status == 400) {
      return error.response.data;
    }
  }
}

export const updateSchedule = async (updateScheduleForm: UpdateScheduleForm) => {
  try {
    const res = await axios.put('/admin/schedules/' + updateScheduleForm.id + '/update', updateScheduleForm);
    toastSuccess(res.data.message);
    return res.data;
  } catch (error: any) {
    toastError(error.response.data.message);

    if (error.response.data.status == 400) {
      return error.response.data;
    }
  }
}

export const deleteSchedule = async (scheduleId: number | any) => {
  try {
    const res = await axios.delete('/admin/schedules/' + scheduleId + '/delete');
    toastSuccess(res.data.message);
    return res;
  } catch (error: any) {
    toastError(error.response.data.message);
  }
}