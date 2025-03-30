'use client';
import MainAdvancePayment from '@/components/features/payments/advance-payment';
import PaymentDetails from '@/components/features/payments/payment-details/page';
import MainPaymentForm from '@/components/features/payments/payment-form';
import PaymentEdit from '@/components/features/payments/payment-form/PaymentEdit';
import MainRentPayment from '@/components/features/payments/rent-payment';
import { RentEdit } from '@/components/features/payments/rent-payment/RentEdit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
const Page = () => {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug : [];
  const slugZero = slug[0];
  const slugOne = slug[1];
  const slugTwo = slug[2];

  if (slugOne === 'new') {
    return (
      <Tabs defaultValue={slugZero || 'rent'} className=''>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger
            value='rent'
            onClick={() => router.push('/payment/rent/new')}
          >
            Rent
          </TabsTrigger>
          <TabsTrigger
            value='advance'
            onClick={() => router.push('/payment/advance/new')}
          >
            Advance
          </TabsTrigger>
          <TabsTrigger
            value='refund'
            onClick={() => router.push('/payment/refund/new')}
          >
            Refund
          </TabsTrigger>
        </TabsList>
        <TabsContent value='rent'>
          <MainRentPayment mode='create' />
        </TabsContent>
        <TabsContent value='advance'>
          <MainAdvancePayment mode='create' />
        </TabsContent>
        <TabsContent value='refund'>
          <h1>Refund Payment</h1>
        </TabsContent>
      </Tabs>
    );
  }
  const id = slugOne;
  return (
    <div>
      {slugZero === 'details' ? (
        <PaymentDetails id={id} />
      ) : slugZero === 'rent' ? (
        <RentEdit id={id} />
      ) : slugZero === 'advance' ? (
        <MainAdvancePayment mode='edit' id={id} />
      ) : slugZero === 'refund' ? (
        <h1>refund</h1>
      ) : (
        <p>Invalid payment type</p>
      )}
    </div>
  );
};

export default Page;
