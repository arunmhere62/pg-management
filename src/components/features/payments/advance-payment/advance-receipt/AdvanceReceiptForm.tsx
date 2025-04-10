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

const receiptSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: 'File is required' })
});

const AdvanceReceiptForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      email: '',
      file: undefined
    }
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = form;

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('file', data.file[0]);

    try {
      const response = await fetch('/api/receipt', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Receipt sent successfully!');
      } else {
        toast.error(result.message || 'Failed to send receipt');
      }
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
          {/* Email Field */}
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter recipient email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload Field (Corrected) */}
          <FormField
            control={control}
            name='file'
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Upload PDF</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='application/pdf'
                    {...field}
                    onChange={(e) => onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Sending...' : 'Send Receipt'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdvanceReceiptForm;
