'use client';
import TenantDetails from '@/components/features/pg-tenants/tenant-details/TenantDetails';
import MainTenantForm from '@/components/features/pg-tenants/tenant-form';
import TenantEdit from '@/components/features/pg-tenants/tenant-form/TenantEdit';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [];
  let type = 'edit';
  let id = slug[0];
  let roomId = slug[1];
  let bedId = slug[2];
  if (slug.length === 2) {
    [type, id] = slug;
  }

  if (slug[0] === 'new') {
    return (
      <MainTenantForm mode='create' bedId={bedId ?? ''} roomId={roomId ?? ''} />
    );
  }
  return (
    <div>
      {type === 'details' ? <TenantDetails id={id} /> : <TenantEdit id={id} />}
    </div>
  );
};

export default Page;
