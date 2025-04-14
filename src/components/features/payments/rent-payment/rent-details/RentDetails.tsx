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
import { fetchRentById } from '@/services/utils/api/payment/rent-api';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { IndianRupee } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface IRentDetailsProps extends ITenantPaymentProps {
  pgLocations: IPgLocationProps;
  rooms: IRoomProps;
  beds: IBedProps;
  tenants: ITenantProps;
}
const RentDetails = ({ id }: { id: string }) => {
  const [rentDetails, setRentDetails] = useState<IRentDetailsProps>();
  useSetBreadcrumbs([
    { title: 'Rent', link: '/payment/rent' },
    { title: 'Details', link: '/rent' }
  ]);
  useEffect(() => {
    const getBed = async () => {
      try {
        const res = await fetchRentById(String(id));
        if (res.data) {
          setRentDetails(res.data);
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
        <h1 className='text-[20px] font-bold'>Rent Details</h1>
        <p className='mb-5 mt-2'>Explore the complete details of this rent. </p>
        <Separator className='mb-6' />
      </div>
      <div className='col-span-12 rounded-xl border p-3 sm:col-span-6'>
        <h1 className='mb-4 text-[20px] font-bold'>Tenant Details</h1>
        <Separator className='mb-4' />
        <ImageCarousel images={rentDetails?.tenants.images || []} />
        <div className='mt-3 p-1'>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Tenant Name</p>
            <p className=''>{rentDetails?.tenants?.name}</p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Phone</p>
            <p className=''>{rentDetails?.tenants?.phoneNo}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Email</p>
            <p className=''>{rentDetails?.tenants?.email}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Pg Location</p>
            <p className=''>{rentDetails?.pgLocations.locationName}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Room No</p>
            <p className=''>{rentDetails?.rooms.roomNo}</p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Bed No:</p>
            <p className=''>{rentDetails?.beds.bedNo}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Check In</p>
            <p className=''>{rentDetails?.tenants?.checkInDate}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Check Out</p>
            <p className=''>{rentDetails?.tenants?.checkOutDate || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Status:</p>
            <p className={cn('w-fit rounded-lg px-3 py-0.5 text-[14px]')}>
              {rentDetails?.tenants?.status.toLocaleUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <div className='col-span-12 sm:col-span-6'>
        <div className='mt-2 rounded-xl border p-5'>
          <h1 className='mb-4 text-[20px] font-bold'>Payment Details</h1>
          <Separator className='mb-4' />
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Remarks</p>
            <p className=''>{rentDetails?.remarks}</p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Payment Date</p>
            <p className=''>
              {formatDateToDDMMYYYY(rentDetails?.paymentDate ?? '')}
            </p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Start Date:</p>
            <p className=''>
              {formatDateToDDMMYYYY(rentDetails?.startDate ?? '')}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>End Date:</p>
            <p className=''>
              {formatDateToDDMMYYYY(rentDetails?.endDate ?? '')}
            </p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Updated At:</p>
            <p className=''>
              {formatDateToDDMMYYYY(rentDetails?.updatedAt ?? '')}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Created At:</p>
            <p className=''>
              {formatDateToDDMMYYYY(rentDetails?.createdAt ?? '')}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Payment Method</p>
            <p className=''>{rentDetails?.paymentMethod}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Payment Status</p>
            <p className=''>{rentDetails?.status}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Amount Paid</p>
            <p className='flex'>
              {' '}
              <IndianRupee className='w-3' />
              {rentDetails?.amountPaid}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Current Bill:</p>
            <p className='flex'>
              <IndianRupee className='w-3' /> {rentDetails?.currentBill}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentDetails;
