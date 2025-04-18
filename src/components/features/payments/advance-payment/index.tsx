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
import AdvanceForm from './AdvanceForm';
import { format } from 'date-fns';
import { fetchTenantsList } from '@/services/utils/api/tenant-api';
import {
  createAdvance,
  updateAdvance
} from '@/services/utils/api/payment/advance-api';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { Modal } from '@/components/ui/modal';

export const paymentFormSchema = z.object({
  tenantId: z.string().min(1, 'Please select a tenant.'),
  paymentDate: z.string().min(1, 'Please select a payment date.'),
  paymentMethod: z.string().min(1, 'Please select a payment method.'),
  status: z.string().min(1, 'Please select a status.'),
  amountPaid: z
    .string()
    .trim()
    .min(1, 'Amount  is required')
    .refine((val) => /^\d+$/.test(val) && Number(val) > 0, {
      message: 'Amount must be a positive number greater than 0'
    }),
  remarks: z.string().min(1, 'Please enter remarks.')
});

interface IMainAdvancePaymentProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<z.infer<typeof paymentFormSchema>>;
  previousPaymentData?: {
    paymentId: number | null;
    pgId: number | null;
    bedId: number | null;
    roomId: number | null;
  };
  tenantId?: string;
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

const MainAdvancePayment = ({
  mode,
  initialData,
  id,
  previousPaymentData,
  tenantId
}: IMainAdvancePaymentProps) => {
  const [tenantList, setTenantList] = useState<ITenantListSelectProps[]>([]);
  const [tenantData, setTenantData] = useState<TenantDataProps[]>([]);
  const [tenantDetails, setTenantDetails] = useState<TenantDataProps | null>(
    null
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formValues, setFormValues] = useState<z.infer<
    typeof paymentFormSchema
  > | null>(null);

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
    mode === 'create' ? 'Add Advance Payment' : 'Edit Advance Payment';

  useSetBreadcrumbs([
    { title: 'Advance', link: '/payment/advance' },
    { title: mode === 'create' ? 'Create' : 'Edit' }
  ]);

  useEffect(() => {
    const getTenants = async () => {
      try {
        const res = await fetchTenantsList();
        if (res.data) {
          setTenantData(res.data);
          setTenantList(
            res.data.map((tenant: any) => ({
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
    tenantId: String(tenantId) || '',
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

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues
  });

  const onSubmit = async (values: z.infer<typeof paymentFormSchema>) => {
    try {
      const payload = {
        tenantId: Number(values.tenantId),
        pgId: Number(pgLocationId),
        bedId: Number(tenantDetails?.beds.id),
        roomId: Number(tenantDetails?.roomId),
        paymentDate: formatDateToDateTime(values.paymentDate),
        paymentMethod: values.paymentMethod,
        status: values.status,
        remarks: values.remarks,
        amountPaid: Number(values.amountPaid)
      };

      if (mode === 'create') {
        const res = await createAdvance(payload);
        if (res.status === 201) {
          toast.success('Tenant Advance added successfully!');
          form.reset({
            tenantId: '',
            paymentDate: '',
            paymentMethod: '',
            status: '',
            remarks: '',
            amountPaid: ''
          });
        }
      } else {
        const res = await updateAdvance(payload, String(id));
        if (res.status === 200) {
          toast.success('Tenant Payment updated successfully!');
          form.reset({
            tenantId: '',
            paymentDate: '',
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

  return (
    <>
      <Card className='mx-auto w-full'>
        <CardHeader>
          <div className='flex justify-between'>
            <CardTitle className='pb-4 text-left text-2xl font-bold'>
              {pageTitle}
            </CardTitle>
          </div>
          <Separator />
        </CardHeader>
        <CardContent className='mt-1'>
          <Form {...form}>
            <form
              id='payment-form'
              onSubmit={form.handleSubmit((values) => {
                setFormValues(values);
                setShowConfirmation(true);
              })}
              className='space-y-8'
            >
              <AdvanceForm
                mode={mode}
                paymentDetails={paymentDetails}
                tenantDetails={tenantDetails || null}
                tenantList={tenantList}
                initialValue={defaultValues}
                onSubmit={onSubmit}
                control={form.control}
              />
              <div className='w-full text-right'>
                <Button type='submit' form='payment-form'>
                  {mode === 'create' ? 'Add Payment' : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Modal
        isOpen={showConfirmation}
        title='Confirm Submission'
        onClose={() => setShowConfirmation(false)}
        contentClassName='w-[90%] sm:w-full rounded-lg'
        description=''
      >
        <p>Are you sure you want to submit this advance payment?</p>
        <div className='mt-6 rounded-md border p-6 shadow-sm'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800'>
            Please confirm the advance details
          </h2>

          <div className='space-y-4 text-sm text-gray-700'>
            <div className='flex justify-between'>
              <span className='font-medium'>Tenant:</span>
              <span>{tenantDetails?.name || '-'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Room No:</span>
              <span>{tenantDetails?.rooms.roomNo || '-'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Rent Amount:</span>
              <span>₹{tenantDetails?.rooms.rentPrice || '-'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Payment Date:</span>
              <span>{formValues?.paymentDate || '-'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Advance Paid:</span>
              <span>₹{formValues?.amountPaid || '-'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Payment Method:</span>
              <span>{formValues?.paymentMethod || '-'}</span>
            </div>
            <div className='col-span-full flex justify-between'>
              <span className='font-medium'>Remarks:</span>
              <span className='text-right'>{formValues?.remarks || '-'}</span>
            </div>
          </div>
        </div>

        <div className='mt-4 flex justify-end gap-4'>
          <Button variant='outline' onClick={() => setShowConfirmation(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (formValues) {
                onSubmit(formValues);
              }
              setShowConfirmation(false);
            }}
          >
            Confirm Payment
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MainAdvancePayment;
