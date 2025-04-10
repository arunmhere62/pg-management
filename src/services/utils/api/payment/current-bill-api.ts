import { API_ENDPOINT } from '@/services/enums/api-endpoint';
import axiosService from '../../axios';

export const updateCurrentBill = async (data: any, id: string) => {
  try {
    const endpoint = API_ENDPOINT.PAYMENT.payment_current_bill_byId.replace(
      ':id',
      id.toString()
    );
    const res = await axiosService.put(endpoint, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
