'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useState } from 'react';
import { EyeIcon, EyeOff } from 'lucide-react';
import axiosService from '@/services/utils/axios';
import { changeEmployeePassword } from '@/services/utils/api/employee-api';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(3, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type PasswordFormType = z.infer<typeof passwordSchema>;

const EmployeePassword = ({ employeeId }: { employeeId?: string }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<PasswordFormType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: PasswordFormType) => {
    try {
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      };
      if (employeeId) {
        const res = await changeEmployeePassword(
          payload,
          employeeId.toString()
        );

        if (res.status === 200) {
          toast.success('Password updated successfully!');
          form.reset();
          location.reload();
        }
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Something went wrong';
      toast.error(msg);
    }
  };

  return (
    <div className='mx-auto max-w-md'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Current Password */}
          <FormField
            control={form.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showCurrent ? 'text' : 'password'}
                      placeholder='Enter current password'
                      {...field}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-2 flex items-center text-gray-500'
                      onClick={() => setShowCurrent((prev) => !prev)}
                    >
                      {showCurrent ? (
                        <EyeOff className='w-4' />
                      ) : (
                        <EyeIcon className='w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Password */}
          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showNew ? 'text' : 'password'}
                      placeholder='Enter new password'
                      {...field}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-2 flex items-center text-gray-500'
                      onClick={() => setShowNew((prev) => !prev)}
                    >
                      {showNew ? (
                        <EyeOff className='w-4' />
                      ) : (
                        <EyeIcon className='w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder='Re-enter new password'
                      {...field}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-2 flex items-center text-gray-500'
                      onClick={() => setShowConfirm((prev) => !prev)}
                    >
                      {showConfirm ? (
                        <EyeOff className='w-4' />
                      ) : (
                        <EyeIcon className='w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full'>
            Update Password
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmployeePassword;
