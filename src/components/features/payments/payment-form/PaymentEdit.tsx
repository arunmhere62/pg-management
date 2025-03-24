import axiosService from '@/services/utils/axios';
import React, { useEffect, useState } from 'react';
import MainPaymentForm from '.';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';

interface PaymentEditFormProps {}
const PaymentEdit = ({ id }: { id: string }) => {
  const [paymentData, setPaymentData] = useState<PaymentEditFormProps>();
  const [previousPaymentData, setPreviousPaymentData] = useState({
    paymentId: null,
    pgId: null,
    bedId: null,
    roomId: null
  });
  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await axiosService.get(`/api/payment/${id}`);
        const formattedRes = {
          tenantId: String(res.data.tenantId),
          status: res.data.status,
          paymentDate: formatDateToDDMMYYYY(res.data.paymentDate),
          startDate: formatDateToDDMMYYYY(res.data.startDate),
          endDate: formatDateToDDMMYYYY(res.data.endDate),
          paymentMethod: res.data.paymentMethod,
          remarks: res.data.remarks,
          amountPaid: res.data.amountPaid
        };
        setPreviousPaymentData({
          paymentId: res.data.id,
          pgId: res.data.pgId,
          bedId: res.data.bedId,
          roomId: res.data.roomId
        });
        setPaymentData(formattedRes);
        console.log('res data', res);
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };
    if (id) {
      getRoom();
    }
  }, [id]);
  return (
    <MainPaymentForm
      id={id}
      mode='edit'
      initialData={paymentData}
      previousPaymentData={previousPaymentData}
    />
  );
};

export default PaymentEdit;
