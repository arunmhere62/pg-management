import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchEmployeeSalaryList = async () => {
  try {
    const res = await axiosService.get(
      `${API_ENDPOINT.EMPLOYEE_SALARY.employee_salary}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getEmployeeSalaryById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.EMPLOYEE_SALARY.employee_salary_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createEmployeeSalary = async (data: any) => {
  try {
    const res = await axiosService.post(
      `${API_ENDPOINT.EMPLOYEE_SALARY.employee_salary}`,
      data
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateEmployeeSalary = async (id: string, data: any) => {
  try {
    const endpoint = API_ENDPOINT.EMPLOYEE_SALARY.employee_salary_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.patch(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEmployeeSalary = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.EMPLOYEE_SALARY.employee_salary_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.delete(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};
