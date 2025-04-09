'use client';
import React, { useCallback, useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSelector } from '@/store';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import TenantForm from './ExpenseForm';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'date-fns';
import { fetchRoomsList } from '@/services/utils/api/rooms-api';
import { fetchBedsByRoomId } from '@/services/utils/api/bed-api';
import { createTenant, updateTenant } from '@/services/utils/api/tenant-api';
import {
  createExpense,
  fetchExpenseList,
  updateExpense
} from '@/services/utils/api/expense-api';
import ExpenseForm from './ExpenseForm';
import { formatDateToDateTime } from '@/services/utils/formaters';

export const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Expense amount is required')
    .refine((val) => /^\d+$/.test(val) && Number(val) > 0, {
      message: 'Expense amount must be a positive number'
    }),
  expenseName: z.string().min(1, 'Expense name is required'),
  description: z.string().optional(),
  expenseDate: z.string().min(1, 'Expense date is required')
});

interface IMainExpenseFormProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<z.infer<typeof expenseFormSchema>>;
}

const MainExpenseForm = ({ mode, initialData, id }: IMainExpenseFormProps) => {
  const { pgLocationId } = useSelector((state) => state.pgLocation);
  const pageTitle = mode === 'create' ? 'Add New Expense' : 'Edit Expense';

  const defaultValues = {
    amount: '',
    expenseName: '',
    description: '',
    expenseDate: '',
    ...initialData
  };

  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues
  });

  const onSubmit = async (values: z.infer<typeof expenseFormSchema>) => {
    try {
      const payload = {
        amount: Number(values.amount),
        expenseName: values.expenseName,
        description: values.description,
        expenseDate: formatDateToDateTime(values.expenseDate)
      };
      if (mode === 'create') {
        const res = await createExpense(payload);
        if (res.status === 201) {
          toast.success('Expense added successfully!');
          form.reset({
            expenseName: '',
            amount: '',
            description: '',
            expenseDate: ''
          });
        }
      } else {
        const res = await updateExpense(payload, String(id));
        if (res.status === 200) {
          toast.success('Expense updated successfully!');
          form.reset({
            amount: '',
            expenseName: '',
            description: '',
            expenseDate: ''
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
            <ExpenseForm
              initialValue={defaultValues}
              onSubmit={onSubmit}
              control={form.control}
            />
            <Button type='submit'>
              {mode === 'create' ? 'Add Expense' : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MainExpenseForm;
