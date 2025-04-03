'use client';
import MainAdvancePayment from '@/components/features/payments/advance-payment';
import { AdvancePaymentTable } from '@/components/features/payments/advance-payment/advance-list/AdvancePaymentTable';
import { AdvanceEdit } from '@/components/features/payments/advance-payment/AdvanceEdit';
import PaymentDetails from '@/components/features/payments/payment-details/page';
import MainRefundPayment from '@/components/features/payments/refund-payment';
import { RefundPaymentTable } from '@/components/features/payments/refund-payment/refund-list/RefundPaymentTable';
import { RefundEdit } from '@/components/features/payments/refund-payment/RefundEdit';
import MainRentPayment from '@/components/features/payments/rent-payment';
import RentPaymentList from '@/components/features/payments/rent-payment/rent-payment-list/RentPaymentTable';
import { RentEdit } from '@/components/features/payments/rent-payment/RentEdit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug : [];
  const slugZero = slug[0]; // rent, advance, refund, details
  const slugOne = slug[1]; // new or id (like 35)
  const slugTwo = slug[2]; // new or id (like 35)
  console.log('slug two', slugTwo);

  const isId = !isNaN(Number(slugOne));

  // -------------- Edit Payment ----------------
  if (isId) {
    return (
      <div>
        {slugZero === 'rent' ? (
          <RentEdit id={slugOne} />
        ) : slugZero === 'advance' ? (
          <AdvanceEdit id={slugOne} />
        ) : slugZero === 'refund' ? (
          <RefundEdit id={slugOne} />
        ) : (
          <p>Invalid payment type</p>
        )}
      </div>
    );
  }
  // -------------- Create New Payment ---------------
  if (slugOne === 'new') {
    return (
      <Tabs defaultValue={slugZero || 'rent'}>
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
          <MainRentPayment tenantId={slugTwo} mode='create' />
        </TabsContent>
        <TabsContent value='advance'>
          <MainAdvancePayment tenantId={slugTwo} mode='create' />
        </TabsContent>
        <TabsContent value='refund'>
          <MainRefundPayment tenantId={slugTwo} mode='create' />
        </TabsContent>
      </Tabs>
    );
  }

  // -------------- List View (Table) ----------------
  if (slugZero === 'rent' || slugZero === 'advance' || slugZero === 'refund') {
    return (
      <Tabs defaultValue={slugZero || 'rent'}>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger
            value='rent'
            onClick={() => router.push('/payment/rent')}
          >
            Rent
          </TabsTrigger>
          <TabsTrigger
            value='advance'
            onClick={() => router.push('/payment/advance')}
          >
            Advance
          </TabsTrigger>
          <TabsTrigger
            value='refund'
            onClick={() => router.push('/payment/refund')}
          >
            Refund
          </TabsTrigger>
        </TabsList>
        <TabsContent value='rent'>
          <RentPaymentList />
        </TabsContent>
        <TabsContent value='advance'>
          <AdvancePaymentTable />
        </TabsContent>
        <TabsContent value='refund'>
          <RefundPaymentTable />
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <div>
      {slugZero === 'details' ? (
        <PaymentDetails id={slugOne} />
      ) : slugZero === 'rent' ? (
        <RentEdit id={slugOne} />
      ) : slugZero === 'advance' ? (
        <AdvanceEdit id={slugOne} />
      ) : slugZero === 'refund' ? (
        <h1>Refund</h1>
      ) : (
        <p>Invalid payment type</p>
      )}
    </div>
  );
};

export default Page;
