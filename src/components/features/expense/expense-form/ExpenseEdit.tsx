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
  expenseName?: string;
  description?: string;
  expenseDate?: string;
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
            expenseName: res.data.expenseName,
            description: res.data.description,
            expenseDate: res.data.expenseDate
              ? formatDateToDDMMYYYY(res.data.expenseDate)
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
