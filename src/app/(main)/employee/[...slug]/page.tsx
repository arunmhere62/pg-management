'use client';
import BedDetails from '@/components/features/pg-beds/bed-details/BedDetails';
import BedEdit from '@/components/features/pg-beds/bed-form/BedEdit';
import EmployeeDetails from '@/components/features/pg-employee/employee-details/EmployeeDetails';
import MainEmployeeForm from '@/components/features/pg-employee/employee-form';
import EmployeeEdit from '@/components/features/pg-employee/employee-form/EmployeeEdit';
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
    return <MainEmployeeForm mode='create' />;
  }
  return (
    <div>
      {type === 'details' ? (
        <EmployeeDetails id={id} />
      ) : (
        <EmployeeEdit id={id} />
      )}
    </div>
  );
};

export default Page;
