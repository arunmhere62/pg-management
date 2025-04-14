'use client';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { Separator } from '@/components/ui/separator';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { cn } from '@/lib/utils';
import {
  IBedProps,
  IRoomProps,
  ITenantProps
} from '@/services/types/common-types';
import { getRoomById } from '@/services/utils/api/rooms-api';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { IndianRupee } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface IBedWithTenant extends IBedProps {
  tenants: ITenantProps[];
}

export interface IRoomDetailsProps extends IRoomProps {
  beds: IBedWithTenant[];
}

const RoomDetails = ({ id }: { id: string }) => {
  const [roomDetails, setRoomDetails] = useState<IRoomDetailsProps>();
  useSetBreadcrumbs([
    { title: 'Room', link: '/room' },
    { title: 'Details', link: '/room' }
  ]);
  useEffect(() => {
    const getRoom = async () => {
      try {
        if (id) {
          const res = await getRoomById(id);
          if (res?.data) {
            setRoomDetails(res.data);
          }
        }
      } catch (error) {
        toast.error('Error fetching room data:');
      }
    };
    if (id) {
      getRoom();
    }
  }, [id]);

  return (
    <div className='grid grid-cols-1 gap-3 rounded-xl border p-5 sm:gap-1 md:grid-cols-12 md:gap-x-8'>
      {/* Header */}
      <div className='col-span-12'>
        <h1 className='text-[20px] font-bold'>Room Details</h1>
        <p className='mb-5 mt-2 text-sm text-gray-600'>
          Explore the complete details of this room, including its features,
          pricing, and availability.
        </p>
        <Separator className='mb-6' />
      </div>

      {/* Images */}
      <div className='col-span-12 rounded-xl md:col-span-6'>
        {/* Room Image Carousel */}
        <ImageCarousel images={roomDetails?.images || []} />

        {/* Section Title */}
        <h2 className='mb-2 mt-4 text-lg font-semibold'>
          Vacant Beds & Tenant Information
        </h2>

        {/* Beds Info List */}
        <div className='space-y-4'>
          {roomDetails?.beds?.length ? (
            roomDetails.beds.map((bed) => (
              <div
                key={bed.id}
                className='rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm'
              >
                <div className='mb-3 flex justify-between'>
                  <span className='w-[120px] font-medium text-gray-600'>
                    Bed Number
                  </span>
                  <span>{bed?.bedNo ?? 'N/A'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='w-[120px] font-medium text-gray-600'>
                    Tenant Name
                  </span>
                  <span>{bed?.tenants?.[0]?.name ?? 'N/A'}</span>
                </div>
              </div>
            ))
          ) : (
            <p className='text-sm text-gray-500'>No bed data available.</p>
          )}
        </div>
      </div>

      {/* Beds Info */}
      <div className='col-span-12 md:col-span-6'>
        <div className='rounded-xl border p-4'>
          <h2 className='mb-2 mt-2 text-[20px] font-semibold'>Room Info</h2>
          <Separator className='mb-3' />
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Room No</p>
            <p>{roomDetails?.roomNo}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>No of Beds:</p>
            <p>{roomDetails?.bedCount}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[120px] font-semibold'>Rent Price</p>
            <p className='flex items-center'>
              <IndianRupee className='mr-1 w-4' />
              {roomDetails?.rentPrice}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Status:</p>
            <p
              className={cn(
                'w-fit rounded-lg px-3 py-0.5 text-[14px]',
                roomDetails?.status === 'AVAILABLE'
                  ? 'activeBadge'
                  : 'inactiveBadge'
              )}
            >
              {roomDetails?.status?.toLocaleUpperCase()}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Updated At:</p>
            <p>{formatDateToDDMMYYYY(roomDetails?.updatedAt ?? '')}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Created At:</p>
            <p>{formatDateToDDMMYYYY(roomDetails?.createdAt ?? '')}</p>
          </div>
          <div className='flex justify-between rounded-lg border p-2'>
            <p className='font-semibold'>Total Beds Amount:</p>
            <p className='flex items-center'>
              <IndianRupee className='mr-1 w-4' />
              {Number(roomDetails?.bedCount) * Number(roomDetails?.rentPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
