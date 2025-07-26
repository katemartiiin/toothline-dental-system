import axios from '../lib/axios';

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
  schedDay: string;
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
  const res = await axios.post('/admin/schedules', scheduleForm);
  return res.data;
}

export const updateSchedule = async (updateScheduleForm: UpdateScheduleForm) => {
  const res = await axios.put('/admin/schedules/' + updateScheduleForm.id + '/update', updateScheduleForm);
  return res.data;
}

export const deleteSchedule = async (scheduleId: number | any) => {
  const res = await axios.delete('/admin/schedules/' + scheduleId + '/delete');
  return res.data;
}