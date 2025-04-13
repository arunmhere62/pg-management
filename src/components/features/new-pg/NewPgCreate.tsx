'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  createFirstPg,
  createPgLocation,
  updatePgLocation
} from '@/services/utils/api/pg-location-api';
import {
  fetchCitiesList,
  fetchStatesList
} from '@/services/utils/api/common-api';
import CreatePgForm from '../pg-location/pg-form/PgForm';
import Cookies from 'js-cookie';

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

interface INewPgCreateProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<z.infer<typeof formSchema>>;
}
const NewPgCreate = ({ mode, initialData, id }: INewPgCreateProps) => {
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // Fetch states only once
  useEffect(() => {
    const getStates = async () => {
      try {
        const res = await fetchStatesList('IN');
        if (res.status === 200) {
          const formattedStateRes = res.data.map((state: IStateData) => ({
            label: String(state.name),
            value: String(state.id)
          }));
          setStatesList(formattedStateRes);
          setStateData(res.data);
        }
      } catch (error) {
        toast.error('Failed to fetch states:');
      }
    };
    getStates();
  }, [initialData?.state]);

  // Fetch cities when state changes
  const fetchCities = useCallback(async (stateIsoCode: string) => {
    try {
      const res = await fetchCitiesList(stateIsoCode);
      if (res.status === 200) {
        const formattedCitiesRes = res.data.map((city: ICityData) => ({
          label: city.name,
          value: city.id.toString()
        }));
        setCitiesList(formattedCitiesRes);
        setCityData(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch cities:');
    }
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        images: values.images,
        locationName: values.locationName,
        address: values.address,
        pincode: values.pincode,
        stateId: Number(values.state),
        cityId: Number(values.city)
      };
      if (mode === 'create') {
        const res = await createFirstPg(payload);
        if (res.status === 201) {
          const pgLocationId =
            res.data?.pgLocationId ||
            res.data?.data?.pgLocationId ||
            res.data?.data?.id;
          if (pgLocationId) {
            Cookies.set('pgLocationId', String(pgLocationId), { expires: 7 });
            window.location.reload();
          }
          console.log('data pg', res.data);
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
        const res = await updatePgLocation(payload, String(id));
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
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Something went wrong.';

      toast.error(errorMessage);
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

  useEffect(() => {
    const state = form.watch('state');
    if (state && stateData?.length) {
      const cityCode = stateData.find(
        (item) => Number(item.id) === Number(state)
      );
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

export default NewPgCreate;
