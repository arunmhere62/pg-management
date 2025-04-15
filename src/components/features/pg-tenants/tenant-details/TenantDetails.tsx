'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { ImageCarousel } from '@/components/ui/ImageCarousel';

import { Separator } from '@/components/ui/separator';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { cn } from '@/lib/utils';
import { fetchTenantById } from '@/services/utils/api/tenant-api';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface IRoomDetailsProps {
  id: number;
  tenantId: string;
  name: string;
  phoneNo: number;
  email: string;
  pgId: number;
  roomId: number;
  bedId: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
  tenantAddress: string;
  occupation: string;
  proofDocuments: string[];
  beds: {
    bedNo: string;
  };
  rooms: {
    roomNo: string;
  };
  tenantPayments: {
    amountPaid: number;
    bedId: number;
    id: number;
    tenantId: number;
    pgId: number;
    roomId: number;
    tenantPaymentId: number;
    createdAt: string;
    modifiedAt: string;
    startDate: string;
    endDate: string;
    paymentDate: string;
    paymentMethod: string;
    remarks: string;
    status: string;
    updatedAt: string;
  }[];
  advancePayments: {
    id: number;
    amountPaid: string;
    paymentDate: string;
    paymentMethod: string;
    status: string;
    remarks: string;
    createdAt: string;
    updatedAt: string;
  }[];
  refundPayments: {
    id: number;
    amountPaid: string;
    paymentDate: string;
    paymentMethod: string;
    status: string;
    remarks: string;
    createdAt: string;
    updatedAt: string;
  }[];
  tenantPaymentHistory: {
    amountPaid: number;
    bedId: number;
    id: number;
    tenantId: number;
    pgId: number;
    roomId: number;
    tenantPaymentId: number;
    createdAt: string;
    modifiedAt: string;
    paymentDate: string;
    paymentMethod: string;
    remarks: string;
    status: string;
    updatedAt: string;
  }[];
}
const RoomDetails = ({ id }: { id: string }) => {
  const [roomDetails, setRoomDetails] = useState<IRoomDetailsProps>();
  useSetBreadcrumbs([
    { title: 'Tenant', link: '/tenant' },
    { title: 'Details', link: '/tenant' }
  ]);
  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await fetchTenantById(String(id));
        setRoomDetails(res.data);
      } catch (error) {
        toast.error('Error fetching room data:');
      }
    };
    if (id) {
      getRoom();
    }
  }, [id]);
  return (
    <div className='mb-4 grid grid-cols-1 gap-3 rounded-xl border p-5 sm:gap-1 md:grid-cols-12 md:gap-x-8'>
      <div className='col-span-12'>
        <h1 className='text-[20px] font-bold'>Tenant Details</h1>
        <p className='mb-5 mt-2'>
          Explore the complete details of this room, including its features,
          pricing, and availability.{' '}
        </p>
        <Separator className='mb-6' />
      </div>
      <div className='col-span-12 h-fit md:col-span-6'>
        <div className='flex space-x-2'>
          <ImageCarousel images={roomDetails?.images || []} />
        </div>
        <div className='mt-5 sm:mt-3'>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Tenant Name</p>
            <p className=''>{roomDetails?.name || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Room No</p>
            <p className=''>{roomDetails?.rooms.roomNo || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Bed No</p>
            <p className=''>{roomDetails?.beds.bedNo || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Phone No:</p>
            <p className=''>{roomDetails?.phoneNo || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Email</p>
            <p className=''>{roomDetails?.email || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Address</p>
            <p className=''>{roomDetails?.tenantAddress || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Occupation</p>
            <p className=''>{roomDetails?.occupation || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Check In Date</p>
            <p className=''>{roomDetails?.checkInDate || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Check Out Date</p>
            <p className=''>{roomDetails?.checkOutDate || 'N/A'}</p>
          </div>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='font-semibold'>Status:</p>
          <p
            className={cn(
              roomDetails?.status === 'ACTIVE' ? 'activeBadge' : 'inactiveBadge'
            )}
          >
            {roomDetails?.status?.toLocaleUpperCase()}
          </p>
        </div>

        <div className='mb-5 flex justify-between'>
          <p className='font-semibold'>Updated At:</p>
          <p className=''>
            {formatDateToDDMMYYYY(roomDetails?.updatedAt ?? '')}
          </p>
        </div>
        <div className='flex justify-between'>
          <p className='font-semibold'>Created At:</p>
          <p className=''>
            {formatDateToDDMMYYYY(roomDetails?.createdAt ?? '')}
          </p>
        </div>
      </div>

      <div className='col-span-12 mt-4 h-fit space-y-2 sm:mt-0 md:col-span-6'>
        <div className='rounded-xl border p-3'>
          <h1 className='text-[20px] font-bold'>Rent Payments</h1>
          <Accordion type='single' collapsible className='w-full'>
            {roomDetails?.tenantPayments?.map((payment, index) => (
              <AccordionItem key={index} value={`payment-${index}`}>
                <AccordionTrigger>Payment #{index + 1}</AccordionTrigger>
                <AccordionContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Amount Paid:</p>
                      <p>{payment?.amountPaid}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Payment Date:</p>
                      <p>{formatDateToDDMMYYYY(payment?.paymentDate)}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Start Date:</p>
                      <p>{formatDateToDDMMYYYY(payment?.startDate)}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>End Date:</p>
                      <p>{formatDateToDDMMYYYY(payment?.endDate)}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Payment Method:</p>
                      <p>{payment?.paymentMethod}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Remarks:</p>
                      <p>{payment?.remarks || 'N/A'}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Status:</p>
                      <p
                        className={cn(
                          payment.status === 'PAID'
                            ? 'activeBadge'
                            : 'inactiveBadge'
                        )}
                      >
                        {payment.status}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className='rounded-xl border p-3'>
          <h1 className='text-[20px] font-bold'>Advance Payment</h1>
          <Accordion type='single' collapsible className='w-full'>
            {roomDetails?.advancePayments?.map((payment, index) => (
              <AccordionItem key={index} value={`payment-${index}`}>
                <AccordionTrigger>Payment #{index + 1}</AccordionTrigger>
                <AccordionContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Amount Paid:</p>
                      <p>{payment.amountPaid}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Payment Date:</p>
                      <p>{formatDateToDDMMYYYY(payment.paymentDate)}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Payment Method:</p>
                      <p>{payment.paymentMethod}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Remarks:</p>
                      <p>{payment.remarks || 'N/A'}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Status:</p>
                      <p
                        className={cn(
                          payment.status === 'PAID'
                            ? 'activeBadge'
                            : 'inactiveBadge'
                        )}
                      >
                        {payment.status}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className='rounded-xl border p-3'>
          <h1 className='text-[20px] font-bold'>Refund Payment</h1>
          <Accordion type='single' collapsible className='w-full'>
            {roomDetails?.refundPayments?.map((payment, index) => (
              <AccordionItem key={index} value={`payment-${index}`}>
                <AccordionTrigger>Payment #{index + 1}</AccordionTrigger>
                <AccordionContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Amount Paid:</p>
                      <p>{payment.amountPaid}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Payment Date:</p>
                      <p>{formatDateToDDMMYYYY(payment.paymentDate)}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Payment Method:</p>
                      <p>{payment.paymentMethod}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Remarks:</p>
                      <p>{payment.remarks || 'N/A'}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-semibold'>Status:</p>
                      <p
                        className={cn(
                          payment.status === 'PAID'
                            ? 'activeBadge'
                            : 'inactiveBadge'
                        )}
                      >
                        {payment.status}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
