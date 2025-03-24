'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CreatePgForm from './PgForm'; // Import the child component
import axiosService from '@/services/utils/axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form } from '@/components/ui/form';
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
  label: string;
  value: string;
}

export interface ICitiesListProps {
  label: string;
  value: string;
}

interface IStateData {
  id: number;
  name: string;
  isoCode: string;
}

interface ICityData {
  id: number;
  name: string;
}

interface IMainPgFormProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<z.infer<typeof formSchema>>;
}
const MainPgForm = ({ mode, initialData, id }: IMainPgFormProps) => {
  console.log('initialData', initialData);

  const [statesList, setStatesList] = useState<IStateListProps[]>([]);
  const [citiesList, setCitiesList] = useState<ICitiesListProps[]>([]);
  const [stateData, setStateData] = useState<IStateData[]>([]);
  const [cityData, setCityData] = useState<ICityData[]>([]);

  const pageTitle = mode === 'create' ? 'Create New PG' : 'Edit PG';

  const defaultValues = {
    images: [],
    locationName: '',
    city: '',
    state: '',
    pincode: '',
    address: '',
    ...initialData
  };
  console.log('defaultValues', defaultValues);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // Fetch states only once
  useEffect(() => {
    const getStates = async () => {
      try {
        const res = await axiosService.post('/api/states', {
          countryCode: 'IN'
        });
        if (res.status === 200) {
          const formattedStateRes = res.data.map((state: IStateData) => ({
            label: String(state.name),
            value: String(state.id)
          }));
          setStatesList(formattedStateRes);
          setStateData(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch states:', error);
      }
    };

    getStates();
  }, [initialData?.state]);

  console.log('statesList', statesList);

  // Fetch cities when state changes
  const fetchCities = useCallback(async (stateIsoCode: string) => {
    try {
      const res = await axiosService.get('/api/cities', {
        params: { stateIsoCode }
      });
      if (res.status === 200) {
        const formattedCitiesRes = res.data.map((city: ICityData) => ({
          label: city.name,
          value: city.id.toString()
        }));
        setCitiesList(formattedCitiesRes);
        setCityData(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  }, []);

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
      toast.error('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        images: initialData.images || [],
        locationName: initialData.locationName || '',
        state: initialData.state,
        city: initialData.city,
        pincode: initialData.pincode || '',
        address: initialData.address || ''
      });
    }
  }, [initialData]);

  console.log('stateData here', stateData);

  useEffect(() => {
    const state = form.watch('state');

    console.log('state', state);
    if (state && stateData?.length) {
      const cityCode = stateData.find(
        (item) => Number(item.id) === Number(state)
      );
      console.log('cityCode', cityCode);

      if (cityCode?.isoCode) {
        fetchCities(cityCode.isoCode);
      }
    }
  }, [form.watch('state')]);

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
              statesList={statesList}
              initialValue={defaultValues}
              citiesList={citiesList}
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
