import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchBedsList = async () => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.BED.bed}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBedById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.BED.bed_ById.replace(':id', id.toString());
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createBed = async (data: any) => {
  try {
    const res = await axiosService.post(`${API_ENDPOINT.BED.bed}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateBed = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.BED.bed_ById.replace(':id', id.toString());
    const res = await axiosService.put(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBedsByRoomId = async (roomId: string) => {
  try {
    const endpoint = API_ENDPOINT.BED.beds_ByRoomId.replace(
      ':id',
      roomId.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};
