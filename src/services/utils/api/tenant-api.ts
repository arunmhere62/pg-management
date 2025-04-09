import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchTenantsList = async (params?: Record<string, any>) => {
  try {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    const res = await axiosService.get(`${API_ENDPOINT.TENANT.tenant}${query}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTenantById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.TENANT.tenant_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createTenant = async (data: any) => {
  try {
    const res = await axiosService.post(`${API_ENDPOINT.TENANT.tenant}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateTenant = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.TENANT.tenant_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.put(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeTenant = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.TENANT.tenant_ById.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.delete(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};
