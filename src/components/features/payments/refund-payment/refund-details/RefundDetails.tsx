'use client';

import { Separator } from '@/components/ui/separator';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { cn } from '@/lib/utils';
import {
  IBedProps,
  IPgLocationProps,
  IRoomProps,
  ITenantPaymentProps,
  ITenantProps
} from '@/services/types/common-types';
import { fetchRefundById } from '@/services/utils/api/payment/refund-api';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface IRefundDetailsProps extends ITenantPaymentProps {
  pgLocations: IPgLocationProps;
  rooms: IRoomProps;
  beds: IBedProps;
  tenants: ITenantProps;
}
const RefundDetails = ({ id }: { id: string }) => {
  const [refundDetails, setRefundDetails] = useState<IRefundDetailsProps>();
  useSetBreadcrumbs([
    { title: 'Refund', link: '/payment/refund' },
    { title: 'Details', link: '/refund' }
  ]);
  useEffect(() => {
    const getBed = async () => {
      try {
        const res = await fetchRefundById(String(id));
        if (res.data) {
          setRefundDetails(res.data);
        }
      } catch (error) {
        toast.error('Error fetching Bed data');
      }
    };
    if (id) {
      getBed();
    }
  }, [id]);
  return (
    <div className='grid grid-cols-12 gap-y-3 rounded-xl border p-5 sm:gap-x-8'>
      <div className='col-span-12'>
        <h1 className='text-[20px] font-bold'>Refund Details</h1>
        <p className='mb-5 mt-2'>Explore the complete details of this rent. </p>
        <Separator className='mb-6' />
      </div>
      <div className='col-span-12 rounded-xl border p-3 sm:col-span-4'>
        <div
          className='h-[500px] w-full overflow-y-scroll'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {refundDetails?.tenants.images?.map((img: string, index: number) => (
            <div key={index}>
              <Image
                alt=''
                src={img}
                width={1000}
                height={1000}
                className='h-[300px] w-full rounded-lg object-contain'
              />
            </div>
          ))}
        </div>
      </div>

      <div className='col-span-12 sm:col-span-4'>
        <div className='rounded-xl border p-5'>
          <h1 className='mb-4 text-[20px] font-bold'>Tenant Details</h1>
          <Separator className='mb-4' />
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Tenant Name</p>
            <p className=''>{refundDetails?.tenants?.name}</p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Phone</p>
            <p className=''>{refundDetails?.tenants?.phoneNo}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Email</p>
            <p className=''>{refundDetails?.tenants?.email}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Check In</p>
            <p className=''>{refundDetails?.tenants?.checkInDate}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Check Out</p>
            <p className=''>{refundDetails?.tenants?.checkOutDate || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Status:</p>
            <p className={cn('w-fit rounded-lg px-3 py-0.5 text-[14px]')}>
              {refundDetails?.tenants?.status.toLocaleUpperCase()}
            </p>
          </div>
        </div>
        {/* Created At */}
      </div>
      <div className='col-span-12 sm:col-span-4'>
        <div className='rounded-xl border p-5'>
          <h1 className='mb-4 text-[20px] font-bold'>PG Details</h1>
          <Separator className='mb-4' />
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Pg Location</p>
            <p className=''>{refundDetails?.pgLocations.locationName}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Room No</p>
            <p className=''>{refundDetails?.rooms.roomNo}</p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Bed No:</p>
            <p className=''>{refundDetails?.beds.bedNo}</p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Status:</p>
            <p className={cn('w-fit rounded-lg px-3 py-0.5 text-[14px]')}>
              {refundDetails?.status?.toLocaleUpperCase()}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Updated At:</p>
            <p className=''>
              {formatDateToDDMMYYYY(refundDetails?.updatedAt ?? '')}
            </p>
          </div>
          <div className='flex justify-between'>
            <p className='font-semibold'>Created At:</p>
            <p className=''>
              {formatDateToDDMMYYYY(refundDetails?.createdAt ?? '')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundDetails;
