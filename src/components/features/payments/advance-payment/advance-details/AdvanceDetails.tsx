'use client';

import { ImageCarousel } from '@/components/ui/ImageCarousel';
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
import { fetchBedById } from '@/services/utils/api/bed-api';
import { fetchAdvanceById } from '@/services/utils/api/payment/advance-api';
import { fetchRentById } from '@/services/utils/api/payment/rent-api';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { IndianRupee } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface IAdvanceDetailsProps extends ITenantPaymentProps {
  pgLocations: IPgLocationProps;
  rooms: IRoomProps;
  beds: IBedProps;
  tenants: ITenantProps;
}
const AdvanceDetails = ({ id }: { id: string }) => {
  const [advanceDetails, setAdvanceDetails] = useState<IAdvanceDetailsProps>();

  useSetBreadcrumbs([
    { title: 'Advance', link: '/payment/advance' },
    { title: 'Details', link: '/advance' }
  ]);
  useEffect(() => {
    const getBed = async () => {
      try {
        const res = await fetchAdvanceById(String(id));
        if (res.data) {
          setAdvanceDetails(res.data);
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
        <h1 className='text-[20px] font-bold'>Advance Details</h1>
        <p className='mb-5 mt-2'>Explore the complete details of this rent. </p>
        <Separator className='mb-6' />
      </div>
      <div className='col-span-12 rounded-xl border p-3 sm:col-span-6'>
        <h1 className='mb-4 text-[20px] font-bold'>Tenant Details</h1>
        <Separator className='mb-4' />
        <ImageCarousel images={advanceDetails?.tenants.images || []} />

        <div className='rounded-xl p-5'>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Tenant Name</p>
            <p className=''>{advanceDetails?.tenants?.name}</p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Phone</p>
            <p className=''>{advanceDetails?.tenants?.phoneNo}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Email</p>
            <p className=''>{advanceDetails?.tenants?.email}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Check In</p>
            <p className=''>{advanceDetails?.tenants?.checkInDate}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Check Out</p>
            <p className=''>{advanceDetails?.tenants?.checkOutDate || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Status:</p>
            <p
              className={cn(
                advanceDetails?.status === 'PAID'
                  ? 'activeBadge'
                  : 'inactiveBadge'
              )}
            >
              {advanceDetails?.tenants?.status.toLocaleUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <div className='col-span-12 sm:col-span-6'>
        <div className='rounded-xl border p-5'>
          <h1 className='mb-4 text-[20px] font-bold'>Advance Details</h1>
          <Separator className='mb-4' />
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Pg Location</p>
            <p className=''>{advanceDetails?.pgLocations.locationName}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Room No</p>
            <p className=''>{advanceDetails?.rooms.roomNo}</p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Bed No:</p>
            <p className=''>{advanceDetails?.beds.bedNo}</p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Status:</p>
            <p
              className={cn(
                advanceDetails?.status === 'PAID'
                  ? 'activeBadge'
                  : 'inactiveBadge'
              )}
            >
              {advanceDetails?.status?.toLocaleUpperCase()}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Updated At:</p>
            <p className=''>
              {formatDateToDDMMYYYY(advanceDetails?.updatedAt ?? '')}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Created At:</p>
            <p className=''>
              {formatDateToDDMMYYYY(advanceDetails?.createdAt ?? '')}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Advance Amount:</p>
            <p className='flex'>
              <IndianRupee className='w-4' />
              {advanceDetails?.amountPaid}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'> Current Bill:</p>
            <p className='flex'>
              {' '}
              <IndianRupee className='w-4' />
              {advanceDetails?.currentBill ?? 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvanceDetails;
