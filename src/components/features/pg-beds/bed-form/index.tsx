'use client';
import React, { useEffect, useState } from 'react';
import axiosService from '@/services/utils/axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSelector } from '@/store';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import BedForm from './BedForm';
import { fetchRoomsList } from '@/services/utils/api/rooms-api';
import { createBed, updateBed } from '@/services/utils/api/bed-api';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { IOptionTypeProps } from '@/services/types/common-types';

export const roomFormSchema = z.object({
  images: z.array(z.string()).optional(),
  bedNo: z
    .string()
    .min(1, 'Bed No is required')
    .refine((val) => /^\d+$/.test(val) && Number(val) > 0, {
      message: 'Bed NO must be a positive number'
    }),
  roomNo: z
    .string()
    .min(1, 'Room No is required')
    .refine((val) => /^\d+$/.test(val) && Number(val) > 0, {
      message: 'Room No must be a positive number'
    })
});

interface IMainBedFormProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<z.infer<typeof roomFormSchema>>;
}
export interface IRoomListProps {
  id: number;
  roomId: number;
  pgId: number;
  roomNo: string;
  bedCount: string;
  status: string;
  rentPrice: string;
  createdAt: string;
  locationNam?: string;
  pgLocations?: {
    locationName: string;
  };
  updatedAt: string;
  images: string[];
}
const MainBedForm = ({ mode, initialData, id }: IMainBedFormProps) => {
  const { pgLocationId, pgLocationName } = useSelector(
    (state) => state.pgLocation
  );
  const [roomList, setRoomList] = useState<IOptionTypeProps[]>([]);
  const pageTitle = mode === 'create' ? 'Create New Bed' : 'Edit Bed';
  useSetBreadcrumbs([
    { title: 'Bed', link: '/bed' },
    {
      title: mode === 'create' ? 'Create' : 'Edit',
      link: '/bed'
    }
  ]);
  useEffect(() => {
    const getRoomList = async () => {
      try {
        const res = await fetchRoomsList();
        if (res.data) {
          const options = res.data.map((data: IRoomListProps) => ({
            label: data.roomNo.toString(),
            value: data.id.toString()
          }));
          setRoomList(options);
        }
      } catch (error) {
        toast.error('Failed to fetch room list:');
      }
    };
    getRoomList();
  }, []);
  const defaultValues = {
    bedNo: '',
    roomNo: '',
    images: [],
    ...initialData
  };

  const form = useForm<z.infer<typeof roomFormSchema>>({
    resolver: zodResolver(roomFormSchema),
    defaultValues
  });

  const onSubmit = async (values: z.infer<typeof roomFormSchema>) => {
    const payload = {
      bedNo: values.bedNo.startsWith('BED')
        ? values.bedNo
        : 'BED' + values.bedNo,
      images: values.images,
      roomNo: Number(values.roomNo),
      pgId: Number(pgLocationId)
    };
    try {
      if (mode === 'create') {
        const res = await createBed(payload);
        if (res.status === 201) {
          toast.success('Bed created successfully!');
          form.reset({
            bedNo: '',
            roomNo: '',
            images: []
          });
        }
      } else if (mode === 'edit') {
        // const res = await axiosService.put(`/api/bed/${id}`, {
        //   data: payload
        // });
        const res = await updateBed(payload, String(id));
        if (res.status === 200) {
          toast.success('Bed updated successfully!');
          form.reset({
            bedNo: '',
            roomNo: '',
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
        bedNo: initialData.bedNo || '',
        roomNo: initialData.roomNo || '',
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
            <BedForm
              mode={mode}
              roomList={roomList}
              initialValue={defaultValues}
              onSubmit={onSubmit}
              control={form.control}
            />
            <Button type='submit'>
              {mode === 'create' ? 'Create New Bed' : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MainBedForm;
