'use client';
import React, { useEffect, useState } from 'react';
import axiosService from '@/services/utils/axios';
import MainRoomForm from './MainEmployeeSalaryForm';
import { getRoomById } from '@/services/utils/api/rooms-api';
import { toast } from 'sonner';
import MainEmployeeSalaryForm from './MainEmployeeSalaryForm';
import { getEmployeeSalaryById } from '@/services/utils/api/employee-salary-api';
import { IEmployeeSalaryProps } from '@/services/types/common-types';
import { formatDateToDDMMYYYY, formatToISO } from '@/services/utils/formaters';

interface IEmployeeSalaryEditProps {
  employeeId: string;
  salaryAmount: string;
  month: string;
  year: string;
  paidDate: string;
  paymentMethod: string;
  remarks: string;
}
const EmployeeSalaryEdit = ({ id }: { id: string }) => {
  const [employeeSalaryData, setEmployeeSalaryData] = useState<
    IEmployeeSalaryEditProps | undefined
  >();
  useEffect(() => {
    const getEmployeeSalary = async () => {
      try {
        const res = await getEmployeeSalaryById(String(id));
        console.log('red dsta', res);

        const formattedRes = {
          employeeId: res.data.userId.toString(),
          salaryAmount: res.data.salaryAmount.toString(),
          month: res.data.month?.toString(),
          year: res.data.year?.toString(),
          paidDate: formatDateToDDMMYYYY(res.data.paidDate),
          paymentMethod: res.data.paymentMethod?.toString() ?? '',
          remarks: res.data.remarks ?? ''
        };
        console.log('formattedRes', formattedRes);

        if (formattedRes) {
          setEmployeeSalaryData(formattedRes);
        }
      } catch (error) {
        toast.error('Error fetching employeeSalary data:');
      }
    };
    if (id) {
      getEmployeeSalary();
    }
  }, [id]);

  return (
    <div>
      {employeeSalaryData && (
        <MainEmployeeSalaryForm
          mode='edit'
          initialData={employeeSalaryData}
          id={id}
        />
      )}
    </div>
  );
};

export default EmployeeSalaryEdit;
