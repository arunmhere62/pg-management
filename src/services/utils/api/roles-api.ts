import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchRoleList = async () => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.ROLES.role}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRoleById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.ROLES.role_ById.replace(':id', id.toString());
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createRole = async (data: any) => {
  try {
    const res = await axiosService.post(`${API_ENDPOINT.ROLES.role}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateRole = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.ROLES.role_ById.replace(':id', id.toString());
    const res = await axiosService.put(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRoleByRoomId = async (roomId: string) => {
  try {
    const endpoint = API_ENDPOINT.ROLES.role_ById.replace(
      ':id',
      roomId.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRole = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.ROLES.role_ById.replace(':id', id.toString());
    const res = await axiosService.delete(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};
