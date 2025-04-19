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
import { employeeSalaryFormSchema } from './MainEmployeeSalaryForm';
import { SelectComboBox } from '@/components/ui/selectComboBox';
import { DatePicker } from '@/components/ui/date-picker';

interface IEmployeeSalaryFormProps {
  initialValue: z.infer<typeof employeeSalaryFormSchema>;
  onSubmit: (values: any) => void;
  control: any;
  employeeList: { label: string; value: string }[];
}

export default function EmployeeSalaryForm({
  initialValue,
  onSubmit,
  control,
  employeeList
}: IEmployeeSalaryFormProps) {
  return (
    <div className='gap:1 grid grid-cols-1 sm:gap-6 md:grid-cols-2'>
      <FormField
        control={control}
        name='employeeId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employee</FormLabel>
            <SelectComboBox
              showSearch
              options={employeeList}
              placeholder='Select an Employee'
              value={field.value}
              onChange={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='salaryAmount'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary Amount</FormLabel>
            <FormControl>
              <Input type='text' placeholder='Enter Salary Amount' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='month'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Month</FormLabel>
            <SelectComboBox
              options={[
                { label: 'January', value: '1' },
                { label: 'February', value: '2' },
                { label: 'March', value: '3' },
                { label: 'April', value: '4' },
                { label: 'May', value: '5' },
                { label: 'June', value: '6' },
                { label: 'July', value: '7' },
                { label: 'August', value: '8' },
                { label: 'September', value: '9' },
                { label: 'October', value: '10' },
                { label: 'November', value: '11' },
                { label: 'December', value: '12' }
              ]}
              placeholder='Select Month'
              value={field.value}
              onChange={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='year'
        render={({ field }) => {
          const currentYear = new Date().getFullYear();
          const yearOptions = Array.from({ length: 11 }, (_, i) => {
            const year = currentYear - 5 + i;
            return { label: year.toString(), value: year.toString() };
          });

          return (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <SelectComboBox
                options={yearOptions}
                placeholder='Select Year'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={control}
        name='paidDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paid Date</FormLabel>
            <FormControl>
              <DatePicker value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='paymentMethod'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Method</FormLabel>
            <SelectComboBox
              options={[
                { value: 'GPAY', label: 'GPay' },
                { value: 'PHONEPE', label: 'PhonePe' },
                { value: 'CASH', label: 'Cash' },
                { value: 'BANK_TRANSFER', label: 'Bank Transfer' }
              ]}
              placeholder='Select a Payment Method'
              value={field.value}
              onChange={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='remarks'
        render={({ field }) => (
          <FormItem className='md:col-span-2'>
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Input type='text' placeholder='Enter any remarks' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
