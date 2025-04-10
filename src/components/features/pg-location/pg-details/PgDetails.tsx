import React from 'react';
import { IPgListProps } from '../pg-list';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/Carousel';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const PgDetails = ({ pgDetails }: { pgDetails: IPgListProps }) => {
  return (
    <div className='grid h-[500px] grid-cols-12 gap-4 overflow-y-scroll'>
      {/* Carousel */}
      <div className='col-span-12 flex h-[350px] items-center justify-center rounded-2xl border'>
        <div className='w-full'>
          <Carousel>
            <CarouselContent>
              {pgDetails?.images?.map((img: string, index: number) => (
                <CarouselItem key={index}>
                  <Image
                    alt=''
                    src={img}
                    width={1000}
                    height={1000}
                    className='h-[300px] w-full rounded-lg object-contain'
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious />
          <CarouselNext /> */}
          </Carousel>
        </div>
      </div>

      {/* Location Name */}
      <p className='col-span-4 font-semibold'>Location Name:</p>
      <p className='col-span-8'>{pgDetails.locationName}</p>

      {/* Address */}
      <p className='col-span-4 font-semibold'>Address:</p>
      <p className='col-span-8'>{pgDetails.address}</p>

      {/* State */}
      <p className='col-span-4 font-semibold'>State:</p>
      <p className='col-span-8'>{pgDetails.stateName}</p>

      {/* City */}
      <p className='col-span-4 font-semibold'>City:</p>
      <p className='col-span-8'>{pgDetails.cityName}</p>

      {/* Pincode */}
      <p className='col-span-4 font-semibold'>Pincode:</p>
      <p className='col-span-8'>{pgDetails.pincode}</p>

      {/* Status */}
      <p className='col-span-4 font-semibold'>Status:</p>
      <p
        className={cn(
          'col-span-8 w-fit rounded-lg px-3 py-0.5 text-[14px]',
          pgDetails.status === 'ACTIVE' ? 'activeBadge' : 'inactiveBadge'
        )}
      >
        {pgDetails?.status?.toLocaleUpperCase()}
      </p>

      {/* Updated At */}
      <p className='col-span-4 font-semibold'>Updated At:</p>
      <p className='col-span-8'>{pgDetails.updatedAt}</p>

      {/* Created At */}
      <p className='col-span-4 font-semibold'>Created At:</p>
      <p className='col-span-8'>{pgDetails.createdAt}</p>
    </div>
  );
};

export default PgDetails;
