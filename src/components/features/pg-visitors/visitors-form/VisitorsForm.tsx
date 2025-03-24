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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker-withrange';
import { roomFormSchema } from '@/components/features/pg-rooms/room-form';
import { DatePicker } from '@/components/ui/date-picker';
import { SelectComboBox } from '@/components/ui/selectComboBox';
import { IBedListSelectProps, IRoomListSelectProps } from '.';
import { TimePicker } from '@/components/ui/TimePicker';

interface IPgLocationFromProps {
  initialValue: {
    visitorName: string;
    phoneNo: string;
    purpose: string;
    visitedDate: string;
    checkInTime: string;
    checkOutTime: string;
    roomId: string;
    bedId: string;
  };
  onSubmit: (values: any) => void;
  control: any;
  roomList: IRoomListSelectProps[];
  bedsList: IBedListSelectProps[];
}
export default function VisitorForm({
  initialValue,
  onSubmit,
  control,
  roomList,
  bedsList
}: IPgLocationFromProps) {
  return (
    <>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <FormField
          control={control}
          name='visitorName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visitor Name</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Enter Visitor Name'
                  {...field}
                />
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
          name='purpose'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Enter Visitor Purpose'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='visitedDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visited Date</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='checkInTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-In Time</FormLabel>
              <FormControl>
                <TimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='checkOutTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-Out Time</FormLabel>
              <FormControl>
                <TimePicker value={field.value} onChange={field.onChange} />
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
      </div>
    </>
  );
}
