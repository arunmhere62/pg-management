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

export const roomFormSchema = z.object({
  images: z.array(z.string()).optional(),
  bedNo: z.string().min(1, 'Bed number is required'),
  status: z.string().min(1, 'Status is required'),
  roomNo: z.string().min(1, { message: 'Room number is required' })
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
  const [roomList, setRoomList] = useState<IRoomListProps[]>([]);
  const pageTitle = mode === 'create' ? 'Create New Bed' : 'Edit Room';

  useEffect(() => {
    const fetchRoomList = async () => {
      try {
        const res = await axiosService.get<IRoomListProps[]>('/api/room');
        if (res.data) setRoomList(res.data);
      } catch (error: unknown) {
        console.error('Failed to fetch room list:', error);
      }
    };
    fetchRoomList();
  }, []);

  const defaultValues = {
    bedNo: '',
    roomNo: '',
    images: [],
    status: '',
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
      status: values.status,
      pgId: Number(pgLocationId)
    };
    try {
      if (mode === 'create') {
        const res = await axiosService.post('/api/bed', {
          data: payload
        });
        if (res.status === 201) {
          toast.success('Bed created successfully!');
          form.reset({
            bedNo: '',
            roomNo: '',
            images: []
          });
        }
      } else if (mode === 'edit') {
        const res = await axiosService.put(`/api/bed/${id}`, {
          data: payload
        });
        if (res.status === 200) {
          toast.success('Bed updated successfully!');
          form.reset({
            bedNo: '',
            roomNo: '',
            status: '',
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
        status: initialData.status || '',
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
