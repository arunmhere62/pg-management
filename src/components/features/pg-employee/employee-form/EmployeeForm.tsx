'use client';
import * as z from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { IOptionTypeProps } from '@/services/types/common-types';
import { SelectComboBox } from '@/components/ui/selectComboBox';
import { useState } from 'react';
import { EyeClosed, EyeIcon, EyeOff } from 'lucide-react';
import { createEmployeeSchema, editEmployeeSchema } from '.';
import ImageUploader from '@/components/ui/ImageUploader';

type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;
type EditEmployeeFormValues = z.infer<typeof editEmployeeSchema>;

export interface IEmployeeFormProps {
  initialValue: CreateEmployeeFormValues | EditEmployeeFormValues;
  onSubmit: (values: CreateEmployeeFormValues | EditEmployeeFormValues) => void;
  control: any;
  mode: 'create' | 'edit';
  rolesList: IOptionTypeProps[];
  citiesList: IOptionTypeProps[];
  statesList: IOptionTypeProps[];
}
export default function EmployeeForm({
  initialValue,
  onSubmit,
  control,
  mode,
  rolesList,
  citiesList,
  statesList
}: IEmployeeFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className='grid grid-cols-1 gap-1 sm:gap-6 md:grid-cols-2'>
        <FormField
          control={control}
          name='profileImages'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Upload Profile Images</FormLabel>
              <FormControl>
                <ImageUploader
                  initialImages={field.value || []}
                  onImagesUpload={(images) => field.onChange(images)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='proofDocuments'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Upload Proof Documents</FormLabel>
              <FormControl>
                <ImageUploader
                  initialImages={field.value || []}
                  onImagesUpload={(images) => field.onChange(images)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Full Name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='example@mail.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === 'create' && (
          <FormField
            control={control}
            name='password'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className='relative'>
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        {...field}
                        className='pr-10'
                      />
                    </FormControl>
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none'
                    >
                      {showPassword ? (
                        <EyeOff className='w-5' />
                      ) : (
                        <EyeIcon className='w-5' />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        <FormField
          control={control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Enter your number'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='pincode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Enter Pincode' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Full Address' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='gender'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <SelectComboBox
                options={[
                  { value: 'MALE', label: 'MALE' },
                  { value: 'FEMALE', label: 'FEMALE' }
                ]}
                placeholder='Select a Gender'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='stateId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <SelectComboBox
                showSearch
                options={statesList || []}
                placeholder='Select a State'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='cityId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <SelectComboBox
                showSearch
                options={citiesList || []}
                placeholder='Select a City'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='roleId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a Role</FormLabel>
              <SelectComboBox
                options={rolesList || []}
                placeholder='Select a Role'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <SelectComboBox
                options={[
                  { value: 'ACTIVE', label: 'ACTIVE' },
                  { value: 'INACTIVE', label: 'INACTIVE' }
                ]}
                placeholder='Select a status'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
