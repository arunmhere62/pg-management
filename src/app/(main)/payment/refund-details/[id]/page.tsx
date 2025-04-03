import RefundDetails from '@/components/features/payments/refund-payment/refund-details/RefundDetails';
import React from 'react';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div>
      <RefundDetails id={id} />
    </div>
  );
};

export default page;
