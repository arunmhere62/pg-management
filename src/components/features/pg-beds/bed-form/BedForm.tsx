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

interface IPgLocationFromProps {
  initialValue: {
    bedNo: string;
    roomNo: string;
    images: string[];
  };
  roomList: IRoomListProps[];
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
              <Select
                disabled={mode === 'edit' ? true : false}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='max-h-[300px] overflow-y-auto'>
                  {roomList &&
                    roomList.length > 0 &&
                    roomList.map((room, index) => (
                      <SelectItem key={index} value={String(room.id)}>
                        {room.roomNo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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
