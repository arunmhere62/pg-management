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
import { Button } from '@/components/ui/button';
import { formSchema, ICitiesListProps, IStateListProps } from '.';

interface IPgLocationFromProps {
  initialValue: {
    images: string[];
    locationName: string;
    city: string;
    state: string;
    pincode: string;
    address: string;
  };
  states: IStateListProps[];
  cities: ICitiesListProps[];
  selectedState: string | undefined;
  setSelectedState: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedCity: string | undefined;
  setSelectedCity: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  control: any;
}
export default function CreatePgForm({
  initialValue,
  states,
  cities,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
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

      {/* ✅ Form Fields */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
              <Select
                onValueChange={(value) => {
                  setSelectedState(value);
                  field.onChange(value);
                }}
                value={selectedState || field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select state' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='max-h-[300px] overflow-y-auto'>
                  {states && states.length > 0 ? (
                    states?.map((state) => (
                      <SelectItem key={state.id} value={String(state.id)}>
                        {state.name}
                      </SelectItem>
                    ))
                  ) : (
                    <p className='p-0 text-center text-sm text-gray-500'>
                      No states available
                    </p>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Fix: Correct Select Handling */}
        <FormField
          control={control}
          name='city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select
                onValueChange={(value) => {
                  setSelectedCity(value);
                  field.onChange(value);
                }}
                value={selectedCity || field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      defaultValue={field.value}
                      placeholder='Select city'
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='max-h-[300px] overflow-y-auto'>
                  {cities && cities.length > 0 ? (
                    cities.map((city) => (
                      <SelectItem key={city.id} value={String(city.id)}>
                        {city.name}
                      </SelectItem>
                    ))
                  ) : (
                    <p className='p-0 text-center text-sm text-gray-500'>
                      No cities available
                    </p>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
