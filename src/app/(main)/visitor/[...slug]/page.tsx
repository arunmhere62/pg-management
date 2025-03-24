'use client';

import VisitorDetails from '@/components/features/pg-visitors/visitors-details/VisitorsDetails';
import MainVisitorsForm from '@/components/features/pg-visitors/visitors-form';
import VisitorsEdit from '@/components/features/pg-visitors/visitors-form/VisitorsEdit';
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
    return <MainVisitorsForm mode='create' />;
  }
  return (
    <div>
      {type === 'details' ? (
        <VisitorDetails id={id} />
      ) : (
        <VisitorsEdit id={id} />
      )}
    </div>
  );
};

export default Page;
