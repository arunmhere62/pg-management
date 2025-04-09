import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchExpenseList = async () => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.EXPENSE.expense}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchExpenseById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.EXPENSE.expense_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createExpense = async (data: any) => {
  try {
    const res = await axiosService.post(
      `${API_ENDPOINT.EXPENSE.expense}`,
      data
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateExpense = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.EXPENSE.expense_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.put(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchExpenseByRoomId = async (roomId: string) => {
  try {
    const endpoint = API_ENDPOINT.EXPENSE.expense_ById.replace(
      ':id',
      roomId.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};
