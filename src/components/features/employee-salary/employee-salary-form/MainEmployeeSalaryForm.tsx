'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSelector } from '@/store';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import EmployeeSalaryForm from './EmployeeSalaryForm';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { fetchEmployeesList } from '@/services/utils/api/employee-api';
import {
  createEmployeeSalary,
  updateEmployeeSalary
} from '@/services/utils/api/employee-salary-api';
import {
  IEmployeeProps,
  IOptionTypeProps
} from '@/services/types/common-types';
import { formatDateToDateTime } from '@/services/utils/formaters';

export const employeeSalaryFormSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  salaryAmount: z
    .string()
    .trim()
    .min(1, 'Salary is required')
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val) && Number(val) > 0, {
      message: 'Salary must be a positive number greater than 0'
    }),
  month: z.string().min(1, 'Month is required'),
  year: z.string().min(1, 'Year is required'),
  paidDate: z.string().min(1, 'Paid date is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  remarks: z.string().optional()
});

interface IMainEmployeeSalaryFormProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<z.infer<typeof employeeSalaryFormSchema>>;
}

const MainEmployeeSalaryForm = ({
  mode,
  initialData,
  id
}: IMainEmployeeSalaryFormProps) => {
  const { pgLocationId } = useSelector((state) => state.pgLocation);
  const [employeeList, setEmployeeList] = useState<IOptionTypeProps[]>([]);

  const pageTitle =
    mode === 'create' ? 'Add Employee Salary' : 'Edit Employee Salary';

  useSetBreadcrumbs([
    { title: 'Employee Salary', link: '/employee-salary' },
    { title: mode ?? 'new', link: '/' }
  ]);

  const getEmployees = async () => {
    try {
      const res = await fetchEmployeesList();
      if (res.data) {
        const formattedRes = res.data.map((emp: IEmployeeProps) => ({
          label: emp.name,
          value: emp.id.toString()
        }));
        setEmployeeList(formattedRes);
      }
    } catch (error) {
      toast.error('Failed to fetch employees');
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);
  const now = new Date();
  const previousMonth = now.getMonth() === 0 ? 12 : now.getMonth(); // getMonth() is 0-based
  const currentYear =
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const form = useForm<z.infer<typeof employeeSalaryFormSchema>>({
    resolver: zodResolver(employeeSalaryFormSchema),
    defaultValues: {
      employeeId: '',
      salaryAmount: '',
      month: previousMonth.toString(),
      year: currentYear.toString(),
      paidDate: '',
      paymentMethod: '',
      remarks: '',
      ...initialData
    }
  });

  const onSubmit = async (values: z.infer<typeof employeeSalaryFormSchema>) => {
    try {
      const payload = {
        employeeId: values.employeeId,
        paidDate: formatDateToDateTime(values.paidDate),
        paymentMethod: values.paymentMethod,
        remarks: values.remarks,
        month: Number(values.month),
        year: Number(values.year),
        salaryAmount: Number(values.salaryAmount)
      };
      console.log('payload', payload);

      if (mode === 'create') {
        const res = await createEmployeeSalary(payload);
        if (res.status === 201) {
          toast.success('Employee salary added successfully!');
          form.reset({
            employeeId: '',
            salaryAmount: '',
            month: '',
            year: '',
            paidDate: '',
            paymentMethod: '',
            remarks: ''
          });
        }
      } else if (mode === 'edit' && id) {
        const res = await updateEmployeeSalary(id, payload);
        if (res.status === 200) {
          toast.success('Employee salary updated successfully!');
          form.reset({
            employeeId: '',
            salaryAmount: '',
            month: '',
            year: '',
            paidDate: '',
            paymentMethod: '',
            remarks: ''
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
      form.reset(initialData);
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
            <EmployeeSalaryForm
              control={form.control}
              initialValue={form.getValues()} // or pass a specific object if needed
              employeeList={employeeList}
              onSubmit={form.handleSubmit(onSubmit)}
            />
            <Button type='submit'>
              {mode === 'create' ? 'Add Salary' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MainEmployeeSalaryForm;
