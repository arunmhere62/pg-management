'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import axiosService from '@/services/utils/axios';

const formSchema = z.object({
  images: z
    .array(z.string())
    .min(1, 'Image is required.')
    .max(4, 'You can upload up to 4 images.'),
  locationName: z.string().min(2, {
    message: 'Location name must be at least 2 characters.'
  }),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().min(4, 'Pincode must be at least 4 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters')
});

interface IStateListProps {
  id: string;
  name: string;
  isoCode: string;
}
interface ICitiesListProps {
  id: string;
  name: string;
  countryCode: string;
  stateCode: string;
}
export default function ProductForm() {
  const pageTitle = 'Add pg details below';
  const [states, setStates] = useState<IStateListProps[]>([]);
  const [cities, setCities] = useState<ICitiesListProps[]>([]);
  const [selectedState, setSelectedState] = useState<string | undefined>(
    undefined
  );
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const getStates = async () => {
      try {
        const res = await axiosService.post<IStateListProps[]>('/api/states', {
          countryCode: 'IN'
        });
        if (res.status === 200) {
          setStates(res.data);
        }
      } catch (error) {
        throw new Error('Failed to fetch states');
      }
    };
    getStates();
  }, []);

  useEffect(() => {
    setSelectedCity(undefined); // Clear city when state changes
    const stateCode = states.find(
      (state) => Number(state.id) === Number(selectedState)
    );
    if (!stateCode) return;
    const getCities = async () => {
      try {
        const res = await axiosService.get<ICitiesListProps[]>('/api/cities', {
          params: { stateCode: stateCode.isoCode }
        });
        if (res.status === 200) {
          setCities(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    };
    getCities();
  }, [selectedState]);

  const defaultValues = {
    images: [],
    locationName: '',
    city: '',
    state: '',
    pincode: '',
    address: ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('submitted values', values);

    try {
      const res = await axiosService.post('/api/pg/create', {
        data: values
      });
      form.reset();
    } catch (error) {}
  }
  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Upload PG Images</FormLabel>
                  <FormControl>
                    <ImageUploader
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
                control={form.control}
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
                control={form.control}
                name='state'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setSelectedState(value);
                        field.onChange(value);
                      }}
                      value={field.value || undefined}
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
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setSelectedCity(value);
                        field.onChange(value);
                      }}
                      value={field.value || undefined}
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
                control={form.control}
                name='pincode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter Pincode'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
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

            <Button type='submit'>Add Product</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
