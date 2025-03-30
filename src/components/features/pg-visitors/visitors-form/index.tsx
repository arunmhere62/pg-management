'use client';
import React, { useCallback, useEffect, useState } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'date-fns';
import TenantForm from './VisitorsForm';
import { fetchRoomsList } from '@/services/utils/api/rooms-api';

export const tenantFormSchema = z.object({
  visitorName: z.string().min(1, 'Visitor Name is required'),
  phoneNo: z.string().min(10, 'Phone number is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  visitedDate: z.string().min(1, 'Check-in date is required'),
  checkInTime: z.string().min(1, 'Check-in time is required'),
  checkOutTime: z.string().optional(),
  roomId: z.string().min(1, 'Room number is required'),
  bedId: z.string().min(1, 'Bed number is required')
});

interface IMainTenantFormProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<z.infer<typeof tenantFormSchema>>;
}
export interface IRoomListSelectProps {
  value: string;
  label: string;
}
export interface IBedListSelectProps {
  value: string;
  label: string;
}

const MainVisitorsForm = ({ mode, initialData, id }: IMainTenantFormProps) => {
  const [roomList, setRoomList] = useState<IRoomListSelectProps[]>([]);
  const [bedsList, setBedsList] = useState<IBedListSelectProps[]>([]);
  const { pgLocationId } = useSelector((state) => state.pgLocation);
  const pageTitle = mode === 'create' ? 'Add New Visitors' : 'Edit Visitors';

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetchRoomsList();
        if (res.data) {
          setRoomList(
            res.data.map((room: any) => ({
              value: String(room.id),
              label: room.roomNo
            }))
          );
        }
      } catch (error) {
        toast.error('Error fetching rooms:');
      }
    };
    fetchRooms();
  }, []);

  // ✅ **Fetch Beds when roomId changes**
  const fetchBeds = useCallback(async (roomId: string) => {
    try {
      const res = await axiosService.get(`/api/bed/room/${roomId}`);
      return (
        res.data?.map((bed: any) => ({
          value: String(bed.id),
          label: bed.bedNo
        })) || []
      );
    } catch (error) {
      toast.error('Error fetching beds:');
      return [];
    }
  }, []);

  const defaultValues = {
    visitorName: '',
    phoneNo: '',
    purpose: '',
    visitedDate: '',
    checkInTime: '',
    checkOutTime: '',
    roomId: '',
    bedId: '',
    ...initialData
  };

  const form = useForm<z.infer<typeof tenantFormSchema>>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues
  });

  const onSubmit = async (values: z.infer<typeof tenantFormSchema>) => {
    try {
      const payload = {
        pgId: Number(pgLocationId),
        visitorName: values.visitorName,
        phoneNo: values.phoneNo,
        purpose: values.purpose,
        visitedDate: values.visitedDate,
        checkInTime: values.checkInTime,
        checkOutTime: values.checkOutTime,
        bedId: Number(values.bedId),
        roomId: Number(values.roomId)
      };

      if (mode === 'create') {
        const res = await axiosService.post('/api/visitors', {
          data: payload
        });
        if (res.data.status === 201) {
          toast.success('Visitors added successfully!');
          form.reset({
            visitorName: '',
            phoneNo: '',
            purpose: '',
            visitedDate: '',
            checkInTime: '',
            checkOutTime: '',
            roomId: '',
            bedId: ''
          });
        }
      } else {
        const res = await axiosService.put(`/api/visitors/${id}`, {
          data: payload
        });
        if (res.status === 200) {
          toast.success('Visitors updated successfully!');
          form.reset({
            visitorName: '',
            phoneNo: '',
            purpose: '',
            visitedDate: '',
            checkInTime: '',
            checkOutTime: '',
            roomId: '',
            bedId: ''
          });
        }
      }
    } catch (error: any) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({ ...defaultValues, ...initialData });
    }
  }, [initialData, form]);

  useEffect(() => {
    const updateBeds = async () => {
      if (form.watch('roomId')) {
        const beds = await fetchBeds(form.watch('roomId'));
        setBedsList(beds);
      }
    };
    updateBeds();
  }, [form.watch('roomId'), fetchBeds]);
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
            <TenantForm
              initialValue={defaultValues}
              onSubmit={onSubmit}
              control={form.control}
              roomList={roomList}
              bedsList={bedsList}
            />
            <Button type='submit'>
              {mode === 'create' ? 'Add Tenant' : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MainVisitorsForm;
