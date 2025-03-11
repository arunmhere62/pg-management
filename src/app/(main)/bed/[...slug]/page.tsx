'use client';
import BedDetails from '@/components/features/pg-beds/bed-details/BedDetails';
import MainBedForm from '@/components/features/pg-beds/bed-form';
import BedEdit from '@/components/features/pg-beds/bed-form/BedEdit';
import BedsList from '@/components/features/pg-beds/bed-list';
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
    return <MainBedForm mode='create' />;
  }
  return (
    <div>
      {type === 'details' ? <BedDetails id={id} /> : <BedEdit id={id} />}
    </div>
  );
};

export default Page;
