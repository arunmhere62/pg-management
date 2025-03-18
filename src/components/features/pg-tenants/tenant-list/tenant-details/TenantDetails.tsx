'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/Carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import axiosService from '@/services/utils/axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

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
  proofDocuments: string[];
  beds: {
    bedNo: string;
  };
  rooms: {
    roomNo: string;
  };
}
const RoomDetails = ({ id }: { id: string }) => {
  const [roomDetails, setRoomDetails] = useState<IRoomDetailsProps>();

  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await axiosService.get<IRoomDetailsProps>(
          `/api/tenant/${id}`
        );
        setRoomDetails(res.data);
      } catch (error) {
        console.error('Error fetching room data:', error);
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
      <div className='col-span-4 rounded-xl border p-3'>
        <div
          className='h-[500px] w-full overflow-y-scroll'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {roomDetails?.proofDocuments?.map((img: string, index: number) => (
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
      <div className='col-span-4 rounded-xl border p-3'>
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
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Tenant Name</p>
          <p className=''>{roomDetails?.name}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Room No</p>
          <p className=''>{roomDetails?.rooms.roomNo}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Bed No</p>
          <p className=''>{roomDetails?.beds.bedNo}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Phone No:</p>
          <p className=''>{roomDetails?.phoneNo}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Email</p>
          <p className=''>{roomDetails?.email}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Check In Date</p>
          <p className=''>{roomDetails?.checkInDate}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Check Out Date</p>
          <p className=''>{roomDetails?.checkOutDate}</p>
        </div>

        <div className='mb-5 flex justify-between'>
          <p className='font-semibold'>Status:</p>
          <p
            className={cn(
              'w-fit rounded-lg px-3 py-0.5 text-[14px]',
              roomDetails?.status === 'ACTIVE' ? 'bg-[#95cf20]' : 'bg-[#fb5656]'
            )}
          >
            {roomDetails?.status.toLocaleUpperCase()}
          </p>
        </div>

        <div className='mb-5 flex justify-between'>
          <p className='font-semibold'>Updated At:</p>
          <p className=''>{roomDetails?.updatedAt}</p>
        </div>
        <div className='flex justify-between'>
          <p className='font-semibold'>Created At:</p>
          <p className=''>{roomDetails?.createdAt}</p>
        </div>
        {/* Created At */}
      </div>
    </div>
  );
};

export default RoomDetails;
