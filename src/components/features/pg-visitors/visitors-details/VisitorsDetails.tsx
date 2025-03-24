'use client';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import axiosService from '@/services/utils/axios';
import React, { useEffect, useState } from 'react';

interface IVisitorDetailsProps {
  id: number;
  visitedBedId: number;
  visitedRoomId: number;
  visitorName: string;
  phoneNo: string;
  purpose: string;
  visitedDate: string;
  checkInTime: string;
  checkOutTime: string;
  createdAt: string;
  updatedAt: string;
  beds: {
    bedNo: string;
  };
  rooms: {
    roomNo: string;
  };
}
const VisitorDetails = ({ id }: { id: string }) => {
  const [visitorDetails, setVisitorDetails] = useState<IVisitorDetailsProps>();

  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await axiosService.get(`/api/visitors/${id}`);
        console.log('visitors data', res);

        setVisitorDetails(res.data.data);
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };
    if (id) {
      getRoom();
    }
  }, [id]);

  return (
    <div className='grid-cols-auto grid w-fit gap-x-8 rounded-xl border p-5'>
      <div className='col-span-1'>
        <h1 className='text-[20px] font-bold'>Visitor Details</h1>
        <p className='mb-5 mt-2'>
          Explore the complete details of this visitor, including its features,
          pricing, and availability.{' '}
        </p>
        <Separator className='mb-6' />
      </div>
      <div className='col-span-1'>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Visitor Name</p>
          <p className=''>{visitorDetails?.visitorName}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Room No</p>
          <p className=''>{visitorDetails?.rooms.roomNo}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Bed No</p>
          <p className=''>{visitorDetails?.beds.bedNo}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Phone No:</p>
          <p className=''>{visitorDetails?.phoneNo}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Purpose</p>
          <p className=''>{visitorDetails?.purpose}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Visited Date</p>
          <p className=''>{visitorDetails?.visitedDate}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Check In Time</p>
          <p className=''>{visitorDetails?.checkInTime}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='w-[100px] font-semibold'>Check Out Time</p>
          <p className=''>{visitorDetails?.checkOutTime}</p>
        </div>
        <div className='mb-5 flex justify-between'>
          <p className='font-semibold'>Updated At:</p>
          <p className=''>{visitorDetails?.updatedAt}</p>
        </div>
        <div className='flex justify-between'>
          <p className='font-semibold'>Created At:</p>
          <p className=''>{visitorDetails?.createdAt}</p>
        </div>
        {/* Created At */}
      </div>
    </div>
  );
};

export default VisitorDetails;
