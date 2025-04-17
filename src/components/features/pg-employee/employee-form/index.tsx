'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axiosService from '@/services/utils/axios';
import * as z from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSelector } from '@/store';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import EmployeeForm from './EmployeeForm';
import {
  ICityDataProps,
  IOptionTypeProps,
  IRoleProps,
  IStateDataProps
} from '@/services/types/common-types';
import { fetchRoleList } from '@/services/utils/api/roles-api';
import {
  createEmployee,
  updateEmployee
} from '@/services/utils/api/employee-api';
import {
  fetchCitiesList,
  fetchStatesList
} from '@/services/utils/api/common-api';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';

// ✅ SCHEMAS
export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(3, 'Password is required'),
  phone: z.string().min(10, 'Phone is required'),
  stateId: z.string().min(1, 'State is required'),
  cityId: z.string().min(1, 'City is required'),
  pincode: z.string().min(4, 'Pincode must be at least 4 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  roleId: z.string().min(1, 'Role is required'),
  status: z.string(),
  gender: z.string().min(1, 'Gender is required'),
  profileImages: z
    .array(z.string())
    .min(1, 'Image is required.')
    .max(4, 'You can upload up to 4 profileImages.'),
  proofDocuments: z
    .array(z.string())
    .min(1, 'Document is required.')
    .max(4, 'You can upload up to 4 documents.')
});

export const editEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().optional(),
  stateId: z.string().min(1, 'State is required'),
  cityId: z.string().min(1, 'City is required'),
  pincode: z.string().min(4, 'Pincode must be at least 4 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().min(10, 'Phone is required'),
  roleId: z.string().min(1, 'Role is required'),
  status: z.string(),
  gender: z.string().min(1, 'Gender is required'),
  profileImages: z
    .array(z.string())
    .min(1, 'Image is required.')
    .max(4, 'You can upload up to 4 profileImages.'),
  proofDocuments: z
    .array(z.string())
    .min(1, 'Document is required.')
    .max(4, 'You can upload up to 4 documents.')
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
  const [statesList, setStatesList] = useState<IOptionTypeProps[]>([]);
  const [citiesList, setCitiesList] = useState<IOptionTypeProps[]>([]);
  const [stateData, setStateData] = useState<IStateDataProps[]>([]);
  const [cityData, setCityData] = useState<ICityDataProps[]>([]);
  const pageTitle = mode === 'create' ? 'Create New Employee' : 'Edit Employee';

  const schema = mode === 'create' ? createEmployeeSchema : editEmployeeSchema;
  useSetBreadcrumbs([
    { title: 'Employees', link: '/employee' },
    {
      title: mode === 'create' ? 'Create' : 'Edit',
      link: '/employee'
    }
  ]);
  const defaultValues = {
    name: '',
    email: '',
    password: '',
    phone: '',
    stateId: '',
    cityId: '',
    pincode: '',
    address: '',
    roleId: '',
    gender: 'MALE',
    status: 'ACTIVE',
    profileImages: [],
    proofDocuments: [],
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
  // Fetch states only once
  useEffect(() => {
    const getStates = async () => {
      try {
        const res = await fetchStatesList('IN');
        if (res.status === 200) {
          const formattedStateRes = res.data.map((state: IStateDataProps) => ({
            label: String(state.name),
            value: String(state.id)
          }));
          setStatesList(formattedStateRes);
          setStateData(res.data);
        }
      } catch (error) {
        toast.error('Failed to fetch states:');
      }
    };
    getStates();
  }, [initialData?.stateId]);

  // Fetch cities when state changes
  const fetchCities = useCallback(async (stateIsoCode: string) => {
    try {
      const res = await fetchCitiesList(stateIsoCode);
      if (res.status === 200) {
        const formattedCitiesRes = res.data.map((city: ICityDataProps) => ({
          label: city.name,
          value: city.id.toString()
        }));
        setCitiesList(formattedCitiesRes);
        setCityData(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch cities:');
    }
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
        gender: values.gender,
        roleId: Number(values.roleId),
        status: values.status,
        cityId: Number(values.cityId),
        stateId: Number(values.stateId),
        pincode: values.pincode,
        address: values.address,
        profileImages: values.profileImages || [],
        proofDocuments: values.proofDocuments || []
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
          status: '',
          gender: '',
          cityId: '',
          stateId: '',
          pincode: '',
          address: '',
          profileImages: [],
          proofDocuments: []
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
        gender: initialData.gender || 'MALE',
        cityId: initialData.cityId?.toString() || '',
        stateId: initialData.stateId?.toString() || '',
        pincode: initialData.pincode || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        roleId: initialData.roleId?.toString() || '',
        status: initialData.status || 'ACTIVE'
      });
    }
  }, [initialData, form]);

  const stateId = useWatch({
    control: form.control,
    name: 'stateId'
  });
  useEffect(() => {
    if (stateId && stateData.length) {
      const selectedState = stateData.find(
        (item) => Number(item.id) === Number(stateId)
      );
      if (selectedState?.isoCode) {
        fetchCities(selectedState.isoCode);
      }
    }
  }, [stateId, stateData, fetchCities]);

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
              citiesList={citiesList}
              statesList={statesList}
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
