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
        if (res.data) {
          const formattedRes = {
            name: res?.data?.name ?? '',
            email: res?.data?.email ?? '',
            phone: res?.data?.phone != null ? res.data.phone.toString() : '',
            gender: res?.data?.gender ?? '',
            roleId: res?.data?.roleId.toString(),
            status: res?.data?.status ?? '',
            cityId: res?.data?.cityId != null ? res.data.cityId.toString() : '',
            stateId:
              res?.data?.stateId != null ? res.data.stateId.toString() : '',
            pincode: res?.data?.pincode ?? '',
            address: res?.data?.address ?? '',
            profileImages: res?.data?.profileImages ?? [],
            proofDocuments: res?.data?.proofDocuments ?? []
          };

          setEmployeeData(formattedRes);
        }
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
