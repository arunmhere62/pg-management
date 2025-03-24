'use client';
import PaymentDetails from '@/components/features/payments/payment-details/page';
import MainPaymentForm from '@/components/features/payments/payment-form';
import PaymentEdit from '@/components/features/payments/payment-form/PaymentEdit';
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
    return <MainPaymentForm mode='create' />;
  }
  return (
    <div>
      {type === 'details' ? (
        <PaymentDetails id={id} />
      ) : (
        <PaymentEdit id={id} />
      )}
    </div>
  );
};

export default Page;
