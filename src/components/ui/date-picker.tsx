'use client';

import * as React from 'react';
import { format, parse } from 'date-fns';
import { CalendarIcon, XCircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

type DatePickerProps = {
  value?: string;
  onChange: (date: string | undefined) => void;
  placeholder?: string;
  className?: string;
};

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const parsedDate = value ? parse(value, 'dd-MM-yyyy', new Date()) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className='relative w-full'>
          <Button
            type='button'
            variant={'outline'}
            className={cn(
              'w-full justify-start pr-10 text-left font-normal',
              !value && 'text-muted-foreground',
              className
            )}
            onClick={() => setOpen((prev) => !prev)} // Toggle calendar on click
          >
            <CalendarIcon className='mr-3 w-4' />
            {value ? (
              format(parsedDate!, 'dd-MM-yyyy')
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>

          {/* ✅ Clear Button (Only if value exists) */}
          {value && (
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700'
              onClick={() => onChange(undefined)}
            >
              <XCircleIcon className='h-5 w-5' />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={parsedDate}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, 'dd-MM-yyyy'));
              setOpen(false); // ✅ Close the calendar after selecting a date
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
