import axiosService from '@/services/utils/axios';
import React, { useEffect, useState } from 'react';
import MainTenantForm from '.';
import { toast } from 'sonner';
import { fetchTenantById } from '@/services/utils/api/tenant-api';
import { fetchExpenseById } from '@/services/utils/api/expense-api';
import { IExpensesProps } from '@/services/types/common-types';
import MainExpenseForm from '.';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';

export interface IExpenseEditProps {
  amount?: string;
  expenseType?: string;
  paidTo?: string;
  paymentMethod?: string;
  remarks?: string;
  paidDate?: string;
}
const ExpenseEdit = ({ id }: { id: string }) => {
  const [expenseData, setExpenseData] = useState<IExpenseEditProps>();
  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await fetchExpenseById(String(id));
        if (res.data) {
          const formattedRes = {
            amount: res.data.amount?.toString(),
            expenseType: res.data.expenseType,
            paidTo: res.data.paidTo,
            paymentMethod: res.data.paymentMethod,
            remarks: res.data.remarks,
            paidDate: res.data.paidDate
              ? formatDateToDDMMYYYY(res.data.paidDate)
              : ''
          };
          setExpenseData(formattedRes);
        }
      } catch (error) {
        toast.error('Error fetching room data:');
      }
    };
    if (id) {
      getRoom();
    }
  }, [id]);
  return <MainExpenseForm id={id} mode='edit' initialData={expenseData} />;
};

export default ExpenseEdit;
