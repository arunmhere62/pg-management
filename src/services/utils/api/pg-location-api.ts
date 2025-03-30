import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchPgLocationsList = async () => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.PG.pg_location}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPgLocationById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.PG.pg_location_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createPgLocation = async (data: any) => {
  try {
    const res = await axiosService.post(`${API_ENDPOINT.PG.pg_location}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updatePgLocation = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.PG.pg_location_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.put(endpoint, data);
    return res;
  } catch (error) {
    throw error;
  }
};
