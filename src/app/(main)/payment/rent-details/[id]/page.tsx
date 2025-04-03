import RentDetails from '@/components/features/payments/rent-payment/rent-details/RentDetails';
import React from 'react';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div>
      <RentDetails id={id} />
    </div>
  );
};

export default page;
