'use client';

import * as React from 'react';
import { format, parse } from 'date-fns'; // ✅ Changed parseISO to parse
import { CalendarIcon } from 'lucide-react';

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
  // ✅ Parse value correctly from "dd-MM-yyyy" format
  const parsedDate = value ? parse(value, 'dd-MM-yyyy', new Date()) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className='mr-3 w-4' />
          {value ? (
            format(parsedDate!, 'dd-MM-yyyy')
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={parsedDate}
          onSelect={(date) =>
            onChange(date ? format(date, 'dd-MM-yyyy') : undefined)
          } // ✅ Emit "dd-MM-yyyy"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
