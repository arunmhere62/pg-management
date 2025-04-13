import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchEmployeesList = async () => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.EMPLOYEE.employee}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchEmployeeById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.EMPLOYEE.employee_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createEmployee = async (data: any) => {
  try {
    const res = await axiosService.post(
      `${API_ENDPOINT.EMPLOYEE.employee}`,
      data
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateEmployee = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.EMPLOYEE.employee_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.put(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchEmployeesByRoomId = async (roomId: string) => {
  try {
    const endpoint = API_ENDPOINT.EMPLOYEE.employee_ById.replace(
      ':id',
      roomId.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.EMPLOYEE.employee_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.delete(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changeEmployeePassword = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.EMPLOYEE.employee_password_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.put(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
