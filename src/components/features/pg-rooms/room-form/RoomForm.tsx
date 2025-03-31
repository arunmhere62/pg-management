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
import { roomFormSchema } from '.';

interface IPgLocationFromProps {
  initialValue: {
    roomNo: string;
    bedCount: string | '';
    rentPrice: string | '';
    images: string[];
  };
  onSubmit: (values: z.infer<typeof roomFormSchema>) => void;
  control: any;
}
export default function RoomForm({
  initialValue,
  onSubmit,
  control
}: IPgLocationFromProps) {
  return (
    <>
      <FormField
        control={control}
        name='images'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Upload PG Images</FormLabel>
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

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <FormField
          control={control}
          name='roomNo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room No</FormLabel>
              <FormControl>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 transform text-[14px] text-gray-500'>
                    RM
                  </span>
                  <Input
                    type='text'
                    placeholder='Enter Room No'
                    className='pl-10'
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='bedCount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bed Count</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Enter No of beds'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='rentPrice'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rent Price</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Enter price' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
