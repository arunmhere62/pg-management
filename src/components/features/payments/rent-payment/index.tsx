'use client';
import React, { useEffect, useState } from 'react';
import axiosService from '@/services/utils/axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useSelector } from '@/store';
import { formatDateToDateTime } from '@/services/utils/formaters';
import { format } from 'date-fns';
import RentForm from './RentForm';
import { createRent, updateRent } from '@/services/utils/api/payment/rent-api';
import { fetchTenantsList } from '@/services/utils/api/tenant-api';

export const rentPaymentFormSchema = z
  .object({
    tenantId: z.string().min(1, 'Please select a tenant.'),
    paymentDate: z.string().min(1, 'Please select a payment date.'),
    startDate: z.string().min(1, 'Please select a start date.'),
    endDate: z.string().min(1, 'Please select a end date.'),
    paymentMethod: z.string().min(1, 'Please select a payment method.'),
    status: z.string().min(1, 'Please select a status.'),
    amountPaid: z.string().min(1, 'Please enter the amount paid.'),
    remarks: z.string().min(1, 'Please enter remarks.')
  })
  .refine((data) => data.startDate !== data.endDate, {
    message: 'Start date and end date cannot be the same.',
    path: ['endDate']
  });

interface IMainRentPaymentProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<z.infer<typeof rentPaymentFormSchema>>;
  previousPaymentData?: {
    paymentId: number | null;
    pgId: number | null;
    bedId: number | null;
    roomId: number | null;
  };
}

export interface ITenantListSelectProps {
  value: string;
  label: string;
}

export interface TenantDataProps {
  id: number;
  bedId: number;
  pgId: number;
  roomId: number;
  tenantId?: string;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  email: string;
  images: string[];
  name: string;
  phoneNo: string;
  proofDocuments: string[];
  status: string;
  updatedAt: string;
  rooms: {
    id: number;
    roomId: number;
    roomNo: string;
    rentPrice: string;
  };
  beds: {
    id: number;
    bedNo: string;
  };
}

const MainRentPayment = ({
  mode,
  initialData,
  id,
  previousPaymentData
}: IMainRentPaymentProps) => {
  const [tenantList, setTenantList] = useState<ITenantListSelectProps[]>([]);
  const [tenantData, setTenantData] = useState<TenantDataProps[]>([]);
  const [tenantDetails, setTenantDetails] = useState<TenantDataProps | null>(
    null
  );
  const [paymentDetails, setPaymentDetails] = useState({
    status: '',
    paymentDate: '',
    startDate: '',
    endDate: '',
    paymentMethod: '',
    remarks: '',
    amountPaid: ''
  });
  const { pgLocationId, pgLocationName } = useSelector(
    (state) => state.pgLocation
  );
  const pageTitle =
    mode === 'create' ? 'Add Rent Payment' : 'Edit Rent Payment';

  useEffect(() => {
    const getTenants = async () => {
      try {
        const res = await fetchTenantsList();
        if (res.data) {
          setTenantData(res.data);
          setTenantList(
            res?.data?.map((tenant: any) => ({
              value: String(tenant.id),
              label: tenant.name
            }))
          );
        }
      } catch (error) {
        toast.error('Error fetching rooms:');
      }
    };
    getTenants();
  }, []);

  const defaultValues = {
    tenantId: '',
    paymentDate:
      new Date().toString() !== 'Invalid Date'
        ? format(new Date(), 'dd-MM-yyyy')
        : '',
    startDate: '',
    endDate: '',
    paymentMethod: '',
    status: 'PAID',
    remarks: '',
    amountPaid: '',
    ...initialData
  };

  const form = useForm<z.infer<typeof rentPaymentFormSchema>>({
    resolver: zodResolver(rentPaymentFormSchema),
    defaultValues
  });

  const onSubmit = async (values: z.infer<typeof rentPaymentFormSchema>) => {
    try {
      const payload = {
        tenantId: Number(values.tenantId),
        pgId: Number(pgLocationId),
        bedId: Number(tenantDetails?.beds.id),
        roomId: Number(tenantDetails?.roomId),
        paymentDate: formatDateToDateTime(values.paymentDate),
        startDate: formatDateToDateTime(values.startDate),
        endDate: formatDateToDateTime(values.endDate),
        paymentMethod: values.paymentMethod,
        status: values.status,
        remarks: values.remarks,
        amountPaid: Number(values.amountPaid)
      };

      console.log('payload', payload);

      if (mode === 'create') {
        const res = await createRent(payload);
        if (res.status === 201) {
          toast.success('Tenant Payment added successfully!');
          form.reset({
            tenantId: '',
            paymentDate: '',
            startDate: '',
            endDate: '',
            paymentMethod: '',
            status: '',
            remarks: '',
            amountPaid: ''
          });
        }
      } else {
        const data = {
          currentPayment: payload,
          previousPayment: previousPaymentData
        };
        const res = await updateRent(data, String(id));
        if (res.status === 200) {
          toast.success('Tenant Payment updated successfully!');
          form.reset({
            tenantId: '',
            paymentDate: '',
            startDate: '',
            endDate: '',
            paymentMethod: '',
            status: '',
            remarks: '',
            amountPaid: ''
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
      form.reset({ ...defaultValues, ...initialData });
    }
  }, [initialData, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      setPaymentDetails((prev: any) => ({
        ...prev,
        paymentDate: values.paymentDate,
        status: values.status,
        remarks: values.remarks,
        amountPaid: values.amountPaid,
        paymentMethod: values.paymentMethod
      }));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const tenantId = form.watch('tenantId');
    if (tenantId) {
      const tenantDetails = tenantData?.find(
        (t) => String(t.id) === String(tenantId)
      );
      setTenantDetails(tenantDetails || null);
    }
  }, [form.watch('tenantId'), tenantData]);

  console.log('tenantDetails', tenantDetails);
  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <div className='flex justify-between'>
          <CardTitle className='pb-4 text-left text-2xl font-bold'>
            {pageTitle}
          </CardTitle>
          <Button type='submit' form='payment-form'>
            {mode === 'create' ? 'Add Payment' : 'Save'}
          </Button>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className='mt-1'>
        <Form {...form}>
          <form
            id='payment-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8'
          >
            <RentForm
              mode={mode}
              paymentDetails={paymentDetails}
              tenantDetails={tenantDetails || null}
              tenantList={tenantList}
              initialValue={defaultValues}
              onSubmit={onSubmit}
              control={form.control}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MainRentPayment;
