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
import { formSchema, ICitiesListProps, IStateListProps } from '.';
import { SelectComboBox } from '@/components/ui/selectComboBox';

interface IPgLocationFromProps {
  initialValue: {
    images: string[];
    locationName: string;
    city: string;
    state: string;
    pincode: string;
    address: string;
  };
  citiesList: ICitiesListProps[];
  statesList: IStateListProps[];
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  control: any;
}
export default function CreatePgForm({
  initialValue,
  citiesList,
  onSubmit,
  control,
  statesList
}: IPgLocationFromProps) {
  return (
    <>
      {/* ✅ Form Fields */}
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
          name='locationName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter Location name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='state'
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <SelectComboBox
                showSearch
                options={statesList || []}
                placeholder='Select a State'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <SelectComboBox
                showSearch
                options={citiesList || []}
                placeholder='Select a City'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Fix: Correct Select Handling */}
        <FormField
          control={control}
          name='pincode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Enter Pincode' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder='Enter address...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
