import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../../axios';

export const fetchRentsList = async () => {
  try {
    const res = await axiosService.get(`${API_ENDPOINT.PAYMENT.payment_rent}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRentById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.PAYMENT.payment_rent_byId.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createRent = async (data: any) => {
  try {
    const res = await axiosService.post(
      `${API_ENDPOINT.PAYMENT.payment_rent}`,
      data
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateRent = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.PAYMENT.payment_rent_byId.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.put(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRent = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.PAYMENT.payment_rent_byId.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.delete(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// export const fetchRentsByRoomId = async(roomId : string) => {
//   try {
//     const endpoint = API_ENDPOINT.Rent.Rents_ByRoomId.replace(':id' , roomId.toString());
//     const res = await axiosService.get(endpoint)
//     return res.data;
//   } catch (error) {
//     throw error;
//   }
// }
