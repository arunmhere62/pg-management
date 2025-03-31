import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../../axios';

export const fetchAdvanceList = async () => {
  try {
    const res = await axiosService.get(
      `${API_ENDPOINT.PAYMENT.payment_advance}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAdvanceById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.PAYMENT.payment_advance_byId.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createAdvance = async (data: any) => {
  try {
    const res = await axiosService.post(
      `${API_ENDPOINT.PAYMENT.payment_advance}`,
      data
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdvance = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.PAYMENT.payment_advance_byId.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.put(endpoint, data);
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
