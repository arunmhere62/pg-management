'use client';
import * as z from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { SelectComboBox } from '@/components/ui/selectComboBox';
import { ITenantListSelectProps, TenantDataProps } from '.';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { format } from 'date-fns';
import { IndianRupee } from 'lucide-react';

interface IPaymentFromProps {
  initialValue: {
    tenantName?: string;
    phoneNo?: string;
    email?: string;
    pgId?: string;
    roomId?: string;
    bedId?: string;
    status?: string;
    images?: string[];
    proofDocuments?: string[];
  };
  onSubmit: (values: any) => void;
  control: any;
  tenantList: ITenantListSelectProps[];
  tenantDetails: TenantDataProps | null;
  mode: 'create' | 'edit';
  paymentDetails: {
    status: string;
    paymentDate: string;
    paymentMethod: string;
    remarks: string;
    amountPaid: string;
  };
}
export default function RefundForm({
  initialValue,
  onSubmit,
  control,
  tenantList,
  tenantDetails,
  paymentDetails,
  mode
}: IPaymentFromProps) {
  return (
    <>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Left Section - Form */}
        <div className='col-span-1 space-y-5'>
          <FormField
            control={control}
            name='tenantId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenant</FormLabel>
                <SelectComboBox
                  disabled={mode === 'edit' ? true : false}
                  options={tenantList || []}
                  placeholder='Select a Tenant'
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='paymentDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Date</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <SelectComboBox
                  options={[
                    { value: 'PAID', label: 'PAID' },
                    { value: 'PENDING', label: 'PENDING' },
                    { value: 'FAILED', label: 'FAILED' }
                  ]}
                  placeholder='Select a Status'
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='paymentMethod'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <SelectComboBox
                  options={[
                    { value: 'GPAY', label: 'GPAY' },
                    { value: 'PHONEPE', label: 'PHONEPE' },
                    { value: 'CASH', label: 'CASH' },
                    { value: 'BANK_TRANSFER', label: 'BANK_TRANSFER' }
                  ]}
                  placeholder='Select a Payment Method'
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='remarks'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Enter tenant remarks'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='amountPaid'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Paid</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter Amount Paid'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Right Section - Tenant Details */}
        <div className='col-span-1 border-l border-gray-200 px-5'>
          <div
            className='mb-4 flex h-fit w-full space-x-4 overflow-x-auto whitespace-nowrap rounded-lg border p-3'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tenantDetails?.images?.map((img: string, index: number) => (
              <div key={index} className='min-w-[300px]'>
                {' '}
                {/* Adjust width as needed */}
                <Image
                  alt=''
                  src={img}
                  width={1000}
                  height={1000}
                  className='h-[100px] w-full rounded-lg object-contain'
                />
              </div>
            ))}
          </div>

          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Name</p>
            <p>{tenantDetails?.name || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Room No</p>
            <p>{tenantDetails?.rooms.roomNo || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Bed No</p>
            <p>{tenantDetails?.beds.bedNo || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Phone No</p>
            <p>{tenantDetails?.phoneNo || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Email</p>
            <p>{tenantDetails?.email || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='w-[100px] font-semibold'>Status</p>
            <p>{tenantDetails?.status || 'N/A'}</p>
          </div>
          <div className='mb-5 flex justify-between'>
            <p className='font-semibold'>Updated At:</p>
            <p>{tenantDetails?.updatedAt || 'N/A'}</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-semibold'>Created At:</p>
            <p>{tenantDetails?.createdAt || 'N/A'}</p>
          </div>
          <Separator className='mb-4 mt-4' />
          <div>
            <p className='text-[20px] font-bold'>Payment Details</p>
          </div>
          <div className='mt-3 rounded-xl bg-[#f1f1f1] p-4'>
            <div className='flex justify-between'>
              <p className='font-semibold dark:text-black'>Status:</p>
              <p className='dark:text-black'>
                {paymentDetails?.status || 'N/A'}
              </p>
            </div>
            <div className='mt-5 flex justify-between'>
              <p className='font-semibold dark:text-black'>Payment Date:</p>
              <p className='dark:text-black'>
                {paymentDetails.paymentDate || 'N/A'}
              </p>
            </div>
            <div className='mt-5 flex justify-between'>
              <p className='font-semibold dark:text-black'>Payment Method:</p>
              <p className='dark:text-black'>
                {paymentDetails.paymentMethod || 'N/A'}
              </p>
            </div>
            <div className='mt-5 flex justify-between'>
              <p className='font-semibold dark:text-black'>Remarks:</p>
              <p className='max-w-[250px] break-words dark:text-black'>
                {paymentDetails.remarks || 'N/A'}
              </p>
            </div>
            <div className='mt-5 flex justify-between'>
              <p className='font-semibold dark:text-black'>Rent Amount:</p>
              <p className='flex dark:text-black'>
                <IndianRupee className='w-4' />{' '}
                {tenantDetails?.rooms.rentPrice || '0'}
              </p>
            </div>
            <p className='mt-5 font-semibold dark:text-[#696969]'>
              Tenant Refund amount :
            </p>
            <div className='mt-2 flex justify-between rounded-lg border border-[#000] p-2'>
              <p className='font-semibold dark:text-black'>Paid Amount:</p>
              <p className='flex dark:text-black'>
                <IndianRupee className='w-4' />{' '}
                {paymentDetails.amountPaid || '0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
