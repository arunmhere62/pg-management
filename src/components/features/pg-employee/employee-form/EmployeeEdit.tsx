'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchEmployeeById } from '@/services/utils/api/employee-api';
import MainEmployeeForm from '.';

const EmployeeEdit = ({ id }: { id: string }) => {
  const [employeeData, setEmployeeData] = useState<any>();
  useEffect(() => {
    const getEmployee = async () => {
      try {
        const res = await fetchEmployeeById(id);
        const formattedRes = {
          id: res.data.id.toString(),
          name: res.data.name,
          phone: res.data.phone,
          email: res.data.email,
          address: res.data.address,
          status: res.data.status,
          password: res.data.password,
          roleId: res.data.roleId.toString()
        };
        setEmployeeData(formattedRes);
      } catch (error) {
        toast.error('Error fetching Employee data');
      }
    };
    if (id) {
      getEmployee();
    }
  }, [id]);
  return (
    <div>
      {employeeData && (
        <MainEmployeeForm mode='edit' initialData={employeeData} id={id} />
      )}
    </div>
  );
};

export default EmployeeEdit;
