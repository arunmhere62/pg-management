'use client';
import React, { useEffect } from 'react';
import axiosService from '@/services/utils/axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSelector } from '@/store';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import RoomForm from './RoomForm';
import { createRoom, updateRoom } from '@/services/utils/api/rooms-api';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';

export const roomFormSchema = z.object({
  images: z
    .array(z.string())
    .min(1, 'Image is required.')
    .max(4, 'You can upload up to 4 images.'),
  roomNo: z
    .string()
    .trim()
    .min(1, 'Room number is required')
    .refine((val) => /^\d+$/.test(val) && Number(val) > 0, {
      message: 'Room number must be a positive number greater than 0'
    }),

  bedCount: z
    .string()
    .trim()
    .min(1, 'Bed count is required')
    .refine((val) => /^\d+$/.test(val) && Number(val) > 0, {
      message: 'Bed count must be a positive number greater than 0'
    }),

  rentPrice: z
    .string()
    .trim()
    .min(1, 'Rent price is required')
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val) && Number(val) > 0, {
      message: 'Rent price must be a positive number greater than 0'
    })
});

interface IMainRoomFormProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<z.infer<typeof roomFormSchema>>;
}
export interface IPgListProps {
  id: string;
  locationName: string;
}
const MainRoomForm = ({ mode, initialData, id }: IMainRoomFormProps) => {
  const { pgLocationId, pgLocationName } = useSelector(
    (state) => state.pgLocation
  );
  const pageTitle = mode === 'create' ? 'Create New Room' : 'Edit Room';
  useSetBreadcrumbs([
    { title: 'Rooms', link: '/room' },
    { title: mode ?? 'new', link: '/' }
  ]);
  const defaultValues = {
    roomNo: '',
    bedCount: '',
    rentPrice: '',
    images: [],
    ...initialData
  };
  const form = useForm<z.infer<typeof roomFormSchema>>({
    resolver: zodResolver(roomFormSchema),
    defaultValues
  });

  const onSubmit = async (values: z.infer<typeof roomFormSchema>) => {
    try {
      const payload = {
        images: values.images,
        roomNo: values.roomNo.startsWith('RM')
          ? values.roomNo
          : 'RM' + values.roomNo,
        bedCount: Number(values.bedCount),
        rentPrice: Number(values.rentPrice),
        pgId: Number(pgLocationId)
      };
      if (mode === 'create') {
        const res = await createRoom(payload);
        if (res.status === 201) {
          toast.success('PG and its Beds created successfully!');
          form.reset({
            roomNo: '',
            bedCount: '',
            rentPrice: '',
            images: []
          });
        }
      } else if (mode === 'edit') {
        const res = await updateRoom(payload, String(id));
        if (res.status === 200) {
          toast.success('PG updated successfully!');
          form.reset({
            roomNo: '',
            bedCount: '',
            rentPrice: '',
            images: []
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
        roomNo: initialData.roomNo || '',
        bedCount: initialData.bedCount || '',
        rentPrice: initialData.rentPrice || '',
        images: initialData.images || []
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
            <RoomForm
              initialValue={defaultValues}
              onSubmit={onSubmit}
              control={form.control}
            />
            <Button type='submit'>
              {mode === 'create' ? 'Create New Room' : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MainRoomForm;
