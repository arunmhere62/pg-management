'use client';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { Separator } from '@/components/ui/separator';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { cn } from '@/lib/utils';
import { fetchBedById } from '@/services/utils/api/bed-api';
import axiosService from '@/services/utils/axios';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface IBedDetailsProps {
  bedNo: string;
  roomNo: string;
  images: string[];
  status: string;
  pgLocations: {
    locationName: string;
  };
  rooms: {
    roomNo: string;
  };
  createdAt: string;
  updatedAt: string;
}
const BedDetails = ({ id }: { id: string }) => {
  const [bedDetails, setBedDetails] = useState<IBedDetailsProps>();
  useSetBreadcrumbs([
    { title: 'Bed', link: '/bed' },
    { title: 'Details', link: '/bed' }
  ]);
  useEffect(() => {
    const getBed = async () => {
      try {
        const res = await fetchBedById(String(id));
        if (res.data) {
          setBedDetails(res.data);
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
    <div className='mb-4 grid grid-cols-12 gap-y-4 rounded-xl border p-5 sm:gap-x-8'>
      <div className='col-span-12'>
        <h1 className='text-[20px] font-bold'>Bed Details</h1>
        <p className='mb-5 mt-2'>
          Explore the complete details of this bed, including its availability.{' '}
        </p>
        <Separator className='mb-6' />
      </div>
      <div className='col-span-12 sm:col-span-6'>
        <ImageCarousel images={bedDetails?.images || []} />
      </div>

      <div className='col-span-12 sm:col-span-5'>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Pg Location</p>
          <p className=''>{bedDetails?.pgLocations.locationName}</p>
        </div>

        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Room No</p>
          <p className=''>{bedDetails?.rooms.roomNo}</p>
        </div>

        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Bed No:</p>
          <p className=''>{bedDetails?.bedNo}</p>
        </div>

        <div className='mb-5 flex justify-between'>
          <p className='font-semibold'>Status:</p>
          <p className={cn('w-fit rounded-lg px-3 py-0.5 text-[14px]')}>
            {bedDetails?.status?.toLocaleUpperCase()}
          </p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='font-semibold'>Updated At:</p>
          <p className=''>
            {formatDateToDDMMYYYY(bedDetails?.updatedAt ?? '')}
          </p>
        </div>
        <div className='flex justify-between'>
          <p className='font-semibold'>Created At:</p>
          <p className=''>
            {formatDateToDDMMYYYY(bedDetails?.createdAt ?? '')}
          </p>
        </div>

        {/* Created At */}
      </div>
    </div>
  );
};

export default BedDetails;
