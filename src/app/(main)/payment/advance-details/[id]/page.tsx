import AdvanceDetails from '@/components/features/payments/advance-payment/advance-details/AdvanceDetails';
import React from 'react';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div>
      <AdvanceDetails id={id} />
    </div>
  );
};

export default page;
