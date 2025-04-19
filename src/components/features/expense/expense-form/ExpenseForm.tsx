'use client';
import * as z from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import ImageUploader from '@/components/ui/ImageUploader';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { SelectComboBox } from '@/components/ui/selectComboBox';

interface IPgLocationFromProps {
  initialValue: {};
  onSubmit: (values: any) => void;
  control: any;
}
export default function ExpenseForm({
  initialValue,
  onSubmit,
  control
}: IPgLocationFromProps) {
  return (
    <>
      <div className='grid grid-cols-1 gap-1 sm:gap-6 md:grid-cols-2'>
        <FormField
          control={control}
          name='expenseType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Type</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Enter Type of Expense'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Amount</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Enter amount ' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='paidDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paid Date</FormLabel>
              <FormControl>
                <DatePicker
                  placeholder='Select Paid Date'
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='paidTo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paid To</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Enter Recipient' {...field} />
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
                  { value: 'GPAY', label: 'GPAY' },
                  { value: 'PHONEPE', label: 'PHONEPE' },
                  { value: 'CASH', label: 'CASH' },
                  { value: 'BANK_TRANSFER', label: 'BANK_TRANSFER' }
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
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Enter Remarks' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
