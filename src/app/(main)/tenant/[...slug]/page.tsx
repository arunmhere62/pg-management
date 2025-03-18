'use client';

import RoomDetails from '@/components/features/pg-rooms/room-details';
import RoomEdit from '@/components/features/pg-rooms/room-form/RoomEdit';
import TenantDetails from '@/components/features/pg-tenants/tenant-list/tenant-details/TenantDetails';
import MainTenantForm from '@/components/features/pg-tenants/tenant-list/tenant-form';
import TenantEdit from '@/components/features/pg-tenants/tenant-list/tenant-form/TenantEdit';
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
    return <MainTenantForm mode='create' />;
  }
  return (
    <div>
      {type === 'details' ? <TenantDetails id={id} /> : <TenantEdit id={id} />}
    </div>
  );
};

export default Page;
