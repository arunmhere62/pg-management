'use client';

import EmployeeSalaryEdit from '@/components/features/employee-salary/employee-salary-form/EmployeeSalaryEditForm';
import MainEmployeeSalaryForm from '@/components/features/employee-salary/employee-salary-form/MainEmployeeSalaryForm';
import RoomDetails from '@/components/features/pg-rooms/room-details/RoomDetails';
import MainRoomForm from '@/components/features/pg-rooms/room-form';
import RoomEdit from '@/components/features/pg-rooms/room-form/RoomEdit';
import TenantDetails from '@/components/features/pg-tenants/tenant-details/TenantDetails';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [];
  let type = 'edit';
  let id = slug[0];
  if (slug.length === 2) {
    [type, id] = slug;
  }
  if (slug[0] === 'new') {
    return <MainEmployeeSalaryForm mode='create' />;
  }
  return (
    <div>
      {type === 'details' ? (
        <RoomDetails id={id} />
      ) : (
        <EmployeeSalaryEdit id={id} />
      )}
    </div>
  );
};

export default Page;
