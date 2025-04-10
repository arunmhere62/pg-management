'use client';
import { Separator } from '@/components/ui/separator';
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
  tenants: ITenantProps[]; // Add tenants to the bed
}

export interface IRoomDetailsProps extends IRoomProps {
  beds: IBedWithTenant[];
}
const RoomDetails = ({ id }: { id: string }) => {
  const [roomDetails, setRoomDetails] = useState<IRoomDetailsProps>();

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
    <div className='grid grid-cols-12 gap-x-8 rounded-xl border p-5'>
      <div className='col-span-12'>
        <h1 className='text-[20px] font-bold'>Room Details</h1>
        <p className='mb-5 mt-2'>
          Explore the complete details of this room, including its features,
          pricing, and availability.{' '}
        </p>
        <Separator className='mb-6' />
      </div>
      <div className='col-span-3 rounded-xl border p-3'>
        <div
          className='h-[500px] w-full overflow-y-scroll'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {roomDetails?.images?.map((img: string, index: number) => (
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

      <div className='col-span-4'>
        <div className='rounded-xl border p-4'>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Room No</p>
            <p className=''>{roomDetails?.roomNo}</p>
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>No of Beds:</p>
            <p className=''>{roomDetails?.bedCount}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Rent Price</p>
            <p className='flex'>
              <span>
                <IndianRupee className='w-4' />
              </span>
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
            <p className=''>
              {formatDateToDDMMYYYY(roomDetails?.updatedAt ?? '')}
            </p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Created At:</p>
            <p className=''>
              {formatDateToDDMMYYYY(roomDetails?.createdAt ?? '')}
            </p>
          </div>
          <div className='flex justify-between rounded-lg border p-2'>
            <p className='font-semibold'>Total Beds Amount:</p>
            <p className='flex'>
              <span>
                <IndianRupee className='w-4' />
              </span>
              {Number(roomDetails?.bedCount) * Number(roomDetails?.rentPrice)}
            </p>
          </div>
        </div>
        {/* Created At */}
      </div>
      <div className='col-span-4'>
        {roomDetails?.beds.map((bed) => (
          <div key={bed.id}>
            <div className='mb-2 rounded-xl border px-3 py-2'>
              <div className='mb-3 flex justify-between'>
                <p className='w-[100px] font-semibold'>Bed No</p>
                <p className=''>{bed?.bedNo ?? 'N/A'}</p>
              </div>
              <div className='flex justify-between'>
                <p className='w-[100px] font-semibold'>Tenant Name</p>
                <p className=''>{bed?.tenants[0]?.name ?? 'N/A'} </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDetails;
