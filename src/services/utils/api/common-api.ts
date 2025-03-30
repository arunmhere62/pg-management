import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../axios';

export const fetchStatesList = async (countryCode: string) => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.COMMON.state}`, {
      params: { countryCode: countryCode }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCitiesList = async (stateIsoCode: string) => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.COMMON.city}`, {
      params: { stateIsoCode }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
