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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface IPgLocationFromProps {
  initialValue: {
    roomNo: string;
    bedCount: string | '';
    rentPrice: string | '';
    status: string;
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
                <Input type='text' placeholder='Enter Room No' {...field} />
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

        <FormField
          control={control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='max-h-[300px] overflow-y-auto'>
                  <SelectItem value='Available'>Available</SelectItem>
                  <SelectItem value='Occupied'>Occupied</SelectItem>
                  <SelectItem value='Maintenance'>Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
