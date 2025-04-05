import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../../axios';

export const fetchRefundList = async () => {
  try {
    const res = await axiosService.get(
      `${API_ENDPOINT.PAYMENT.payment_refund}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRefundById = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.PAYMENT.payment_refund_byId.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.get(endpoint);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createRefund = async (data: any) => {
  try {
    const res = await axiosService.post(
      `${API_ENDPOINT.PAYMENT.payment_refund}`,
      data
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateRefund = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.PAYMENT.payment_refund_byId.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.put(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRefund = async (id: string) => {
  try {
    const endpoint = API_ENDPOINT.PAYMENT.payment_refund_byId.replace(
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
