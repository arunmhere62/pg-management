import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { updateCurrentBill } from '@/services/utils/api/payment/current-bill-api';

const receiptSchema = z.object({
  currentBill: z
    .string()
    .trim()
    .min(1, 'Current Bill  is required')
    .refine((val) => /^\d+$/.test(val) && Number(val) > 0, {
      message: 'Current Bill must be a positive number greater than 0'
    })
});
type CurrentBillFormProps = {
  tenantPaymentId: number | null;
  onSubmit: (payload: { currentBill: number }) => Promise<void>;
};

const CurrentBillForm = ({
  tenantPaymentId,
  onSubmit
}: CurrentBillFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      currentBill: ''
    }
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = form;

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        currentBill: Number(data.currentBill)
      };
      await onSubmit(payload); // call the parent function
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='mb-5 text-[18px] font-semibold'>
        Add tenant current bill in the below form
      </h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
          <FormField
            control={control}
            name='currentBill'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Bill</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter Current Bill Amount'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Sending...' : 'Send Receipt'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CurrentBillForm;
