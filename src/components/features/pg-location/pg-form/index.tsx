'use client';
import React, { useState, useEffect } from 'react';
import CreatePgForm from './PgForm'; // Import the child component
import axiosService from '@/services/utils/axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
export const formSchema = z.object({
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

export interface IStateListProps {
  id: string;
  name: string;
  isoCode: string;
}
export interface ICitiesListProps {
  id: string;
  name: string;
  countryCode: string;
  stateCode: string;
}
interface IMainPgFormProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<z.infer<typeof formSchema>>;
}
const MainPgForm = ({ mode, initialData, id }: IMainPgFormProps) => {
  const [states, setStates] = useState<IStateListProps[]>([]);
  const [cities, setCities] = useState<ICitiesListProps[]>([]);
  const [selectedState, setSelectedState] = useState<string | undefined>(
    initialData?.state
  );
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    initialData?.city
  );
  const pageTitle = mode === 'create' ? 'Create New PG' : 'Edit PG';

  const defaultValues = {
    images: [],
    locationName: '',
    city: '',
    state: initialData?.state?.toString() || '',
    pincode: '',
    address: '',
    ...initialData
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  useEffect(() => {
    const getStates = async () => {
      try {
        const res = await axiosService.post<IStateListProps[]>('/api/states', {
          countryCode: 'IN'
        });
        if (res.status === 200) {
          setStates(res.data);
          if (initialData?.state) {
            const stateExists = res.data.find(
              (state) => Number(state.id) === Number(initialData.state)
            );
            if (stateExists) setSelectedState(stateExists.id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch states:', error);
      }
    };
    getStates();
  }, [initialData?.state]);

  useEffect(() => {
    if (!selectedState) return;
    const getCities = async () => {
      try {
        const res = await axiosService.get<ICitiesListProps[]>('/api/cities', {
          params: {
            stateCode: states.find(
              (state) => Number(state.id) === Number(selectedState)
            )?.isoCode
          }
        });
        if (res.status === 200) {
          setCities(res.data);
          if (initialData?.city) {
            const cityExists = res.data.find(
              (city) => Number(city.id) === Number(initialData.city)
            );
            if (cityExists) {
              setSelectedCity(cityExists.id);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    };
    getCities();
  }, [selectedState, states, initialData?.city]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (mode === 'create') {
        const res = await axiosService.post('/api/pg/create', { data: values });
        if (res.status === 200) {
          toast.success('PG created successfully!');
          form.reset({
            images: [],
            locationName: '',
            city: '',
            state: '',
            pincode: '',
            address: ''
          });
        }
      } else if (mode === 'edit') {
        const res = await axiosService.put(`/api/pg/${id}`, { data: values });
        if (res.status === 200) {
          toast.success('PG updated successfully!');
          form.reset({
            images: [],
            locationName: '',
            city: '',
            state: '',
            pincode: '',
            address: ''
          });
        }
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      if (error.response?.status === 409) {
        toast.error('Conflict occurred. Please check your input.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        images: initialData.images || [],
        locationName: initialData.locationName || '',
        city: initialData.city?.toString() || '',
        state: initialData.state?.toString() || '',
        pincode: initialData.pincode || '',
        address: initialData.address || ''
      });
    }
  }, [initialData, form]);

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='pb-4 text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className='mt-1'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <CreatePgForm
              initialValue={defaultValues}
              states={states}
              cities={cities}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              onSubmit={onSubmit}
              control={form.control}
            />
            <Button type='submit'>
              {mode === 'create' ? 'Create New PG' : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MainPgForm;
