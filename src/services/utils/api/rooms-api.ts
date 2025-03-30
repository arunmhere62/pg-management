import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchRoomsList = async () => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.room}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getRoomById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.room_ById.replace(':id', id.toString());
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createRoom = async (data: any) => {
  try {
    const res = await axiosService.post(`${API_ENDPOINT.room}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateRoom = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.room_ById.replace(':id', id.toString());
    const res = await axiosService.put(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
