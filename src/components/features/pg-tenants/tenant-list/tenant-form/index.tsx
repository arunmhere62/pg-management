'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import TenantForm from './TenantForm';
import { v4 as uuidv4 } from 'uuid';
import { formatDate } from '@/services/utils/formaters';
import { parse } from 'date-fns';
export const tenantFormSchema = z
  .object({
    tenantName: z.string().min(1, 'Tenant name is required'),
    phoneNo: z.string().min(10, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
    roomId: z.string().min(1, 'Room number is required'),
    bedId: z.string().min(1, 'Bed number is required'),
    checkInDate: z.string().min(1, 'Check-in date is required'),
    checkOutDate: z.string().min(1, 'Check-out date is required'),
    status: z.string().min(1, 'Status is required'),
    images: z
      .array(z.string())
      .min(1, 'Image is required.')
      .max(4, 'You can upload up to 4 images.'),
    proofDocuments: z
      .array(z.string())
      .min(1, 'Document is required.')
      .max(4, 'You can upload up to 4 documents.')
  })
  .refine(
    (data) => {
      const checkInDate = parse(data.checkInDate, 'dd-MM-yyyy', new Date());
      const checkOutDate = parse(data.checkOutDate, 'dd-MM-yyyy', new Date());

      return checkOutDate > checkInDate;
    },
    {
      message: 'Check-out date must be after check-in date.',
      path: ['checkOutDate']
    }
  );

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

const MainTenantForm = ({ mode, initialData, id }: IMainTenantFormProps) => {
  const [roomList, setRoomList] = useState<IRoomListSelectProps[]>([]);
  const [bedsList, setBedsList] = useState<IBedListSelectProps[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const { pgLocationId } = useSelector((state) => state.pgLocation);
  const pageTitle = mode === 'create' ? 'Add New Tenant' : 'Edit Tenant';

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axiosService.get('/api/room');
        if (res.data) {
          setRoomList(
            res.data.map((room: any) => ({
              value: String(room.id),
              label: room.roomNo
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
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
      console.error('Error fetching beds:', error);
      return [];
    }
  }, []);

  const defaultValues = {
    tenantName: '',
    phoneNo: '',
    email: '',
    roomId: '',
    bedId: '',
    checkInDate: '',
    checkOutDate: '',
    status: '',
    images: [],
    proofDocuments: [],
    ...initialData
  };

  const form = useForm<z.infer<typeof tenantFormSchema>>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues
  });

  const onSubmit = async (values: z.infer<typeof tenantFormSchema>) => {
    console.log('values payload', values);
    try {
      const payload = {
        tenantId: uuidv4(),
        pgId: Number(pgLocationId),
        bedId: Number(values.bedId),
        roomId: Number(values.roomId),
        name: values.tenantName,
        phoneNo: values.phoneNo,
        email: values.email,
        checkInDate: values.checkInDate,
        checkOutDate: values.checkOutDate,
        status: values.status,
        images: values.images || [],
        proofDocuments: values.proofDocuments || []
      };
      console.log('payload pg', payload);

      if (mode === 'create') {
        const res = await axiosService.post('/api/tenant', {
          data: payload
        });
        if (res.status === 201) {
          toast.success('Tenant added successfully!');
          form.reset({
            tenantName: '',
            phoneNo: '',
            email: '',
            roomId: '',
            bedId: '',
            checkInDate: '',
            checkOutDate: '',
            status: '',
            images: [],
            proofDocuments: []
          });
        }
      } else {
        const res = await axiosService.put(`/api/tenant/${id}`, {
          data: payload
        });
        if (res.status === 200) {
          toast.success('Tenant updated successfully!');
          form.reset({
            tenantName: '',
            phoneNo: '',
            email: '',
            roomId: '',
            bedId: '',
            checkInDate: '',
            checkOutDate: '',
            status: '',
            images: [],
            proofDocuments: []
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
  // ✅ **Trigger Bed List Fetch when Room Changes**
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

export default MainTenantForm;
