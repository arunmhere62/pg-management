'use client';
import * as z from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import ImageUploader from '@/components/ui/ImageUploader';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { SelectComboBox } from '@/components/ui/selectComboBox';
import { IOptionTypeProps } from '@/services/types/common-types';

interface IPgLocationFromProps {
  initialValue: {
    tenantName?: string;
    phoneNo?: string;
    email?: string;
    pgId?: string;
    roomId?: string;
    bedId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    status?: string;
    images?: string[];
    proofDocuments?: string[];
  };
  onSubmit: (values: any) => void;
  control: any;
  roomList: IOptionTypeProps[];
  bedsList: IOptionTypeProps[];
}
export default function TenantForm({
  initialValue,
  onSubmit,
  control,
  roomList,
  bedsList
}: IPgLocationFromProps) {
  return (
    <>
      <div className='grid grid-cols-1 gap-2 sm:gap-6 md:grid-cols-2'>
        <FormField
          control={control}
          name='images'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Upload Tenant Images</FormLabel>
              <FormControl>
                <ImageUploader
                  initialImages={field.value || []}
                  onImagesUpload={(images) => field.onChange(images)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='proofDocuments'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Upload Tenant Proof Documents</FormLabel>
              <FormControl>
                <ImageUploader
                  initialImages={field.value || []}
                  onImagesUpload={(images) => field.onChange(images)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='tenantName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant Name</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Enter Tenant Name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='phoneNo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone No</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Enter Phone Number'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='tenantAddress'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant Address</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Enter Tenant Address'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='occupation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant Occupation</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Enter Tenant Occupation'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='checkInDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-in Date</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='checkOutDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-out Date</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Enter tenant email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='roomId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <SelectComboBox
                options={roomList || []}
                placeholder='Select a room'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='bedId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bed</FormLabel>
              <SelectComboBox
                options={bedsList || []}
                placeholder='Select a bed'
                value={field.value}
                onChange={field.onChange}
              />
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
                  { value: 'ACTIVE', label: 'ACTIVE' },
                  { value: 'INACTIVE', label: 'INACTIVE' }
                ]}
                placeholder='Select a status'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
