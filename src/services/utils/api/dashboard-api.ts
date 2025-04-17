import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchDashboardOverview = async () => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.DASHBOARD.OVERVIEW}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
