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
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <FormField
          control={control}
          name='expenseName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Name</FormLabel>
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
          name='expenseDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Date</FormLabel>
              <FormControl>
                <DatePicker
                  placeholder='Select Expense Date'
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
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Enter Description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
