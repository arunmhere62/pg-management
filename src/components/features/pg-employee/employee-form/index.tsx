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
import EmployeeForm from './EmployeeForm';
import { IOptionTypeProps, IRoleProps } from '@/services/types/common-types';
import { fetchRoleList } from '@/services/utils/api/roles-api';
import {
  createEmployee,
  updateEmployee
} from '@/services/utils/api/employee-api';

// ✅ SCHEMAS
export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(3, 'Password is required'),
  phone: z.string().min(10, 'Phone is required'),
  roleId: z.string().min(1, 'Role is required'),
  status: z.string()
});

export const editEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().optional(),
  phone: z.string().min(10, 'Phone is required'),
  roleId: z.string().min(1, 'Role is required'),
  status: z.string()
});

// ✅ TYPES
export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;
export type EditEmployeeFormValues = z.infer<typeof editEmployeeSchema>;

interface IMainEmployeeFormProps {
  id?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<CreateEmployeeFormValues>;
}

const MainEmployeeForm = ({
  mode,
  initialData,
  id
}: IMainEmployeeFormProps) => {
  const { pgLocationId } = useSelector((state) => state.pgLocation);
  const [rolesList, setRolesList] = useState<IOptionTypeProps[]>([]);

  const pageTitle = mode === 'create' ? 'Create New Employee' : 'Edit Employee';

  const schema = mode === 'create' ? createEmployeeSchema : editEmployeeSchema;

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    phone: '',
    roleId: '',
    status: 'ACTIVE',
    ...initialData
  };

  const form = useForm<CreateEmployeeFormValues | EditEmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues
  });

  useEffect(() => {
    const getRoles = async () => {
      try {
        const res = await fetchRoleList();
        const formattedRes = res.data.map((role: IRoleProps) => ({
          label: role.roleName,
          value: role.id.toString()
        }));
        setRolesList(formattedRes);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error ||
            error?.message ||
            'Something went wrong.'
        );
      }
    };
    getRoles();
  }, []);

  const onSubmit = async (
    values: CreateEmployeeFormValues | EditEmployeeFormValues
  ) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        ...(mode === 'create' && { password: values.password }),
        phone: values.phone,
        roleId: Number(values.roleId),
        status: values.status
      };

      const res =
        mode === 'create'
          ? await createEmployee(payload)
          : await updateEmployee(payload, String(id));

      if (res.status === 201 || res.status === 200) {
        toast.success(
          mode === 'create'
            ? 'Employee created successfully!'
            : 'Employee updated successfully!'
        );
        form.reset({
          name: '',
          email: '',
          password: '',
          phone: '',
          roleId: '',
          status: ''
        });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          'Something went wrong.'
      );
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '',
        phone: initialData.phone || '',
        roleId: initialData.roleId?.toString() || '',
        status: initialData.status || 'ACTIVE'
      });
    }
  }, [initialData, form]);

  return (
    <Card className='mx-auto w-full shadow-none'>
      <CardHeader>
        <CardTitle className='pb-4 text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className='mt-1'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <EmployeeForm
              mode={mode}
              initialValue={defaultValues}
              onSubmit={onSubmit}
              control={form.control}
              rolesList={rolesList}
            />
            <Button type='submit'>
              {mode === 'create' ? 'Create Employee' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MainEmployeeForm;
