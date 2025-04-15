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
import { IRoomListProps, roomFormSchema } from '.';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SelectComboBox } from '@/components/ui/selectComboBox';
import { IOptionTypeProps } from '@/services/types/common-types';

interface IPgLocationFromProps {
  initialValue: {
    bedNo: string;
    roomNo: string;
    images: string[];
  };
  roomList: IOptionTypeProps[];
  onSubmit: (values: z.infer<typeof roomFormSchema>) => void;
  control: any;
  mode: 'create' | 'edit';
}
export default function BedForm({
  initialValue,
  roomList,
  onSubmit,
  control,
  mode
}: IPgLocationFromProps) {
  return (
    <>
      <div className='grid grid-cols-1 gap-1 sm:gap-6 md:grid-cols-2'>
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
        <FormField
          control={control}
          name='roomNo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <SelectComboBox
                showSearch
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
          name='bedNo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bed No</FormLabel>
              <FormControl>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 transform text-[14px] text-gray-500'>
                    BED
                  </span>
                  <Input
                    className='pl-[45px]'
                    type='text'
                    placeholder='Enter Bed No'
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
