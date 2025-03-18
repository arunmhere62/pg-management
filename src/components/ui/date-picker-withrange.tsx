'use client';

import * as React from 'react';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface DatePickerWithRangeProps {
  value: { from: string | null; to: string | null }; // Value from parent
  onChange: (date: { from: string | null; to: string | null }) => void; // Function from parent
  className?: string;
}

export function DatePickerWithRange({
  className,
  value,
  onChange
}: DatePickerWithRangeProps) {
  // Function to handle date selection and send it to the parent
  const handleDateChange = (selectedDate: DateRange | undefined) => {
    onChange({
      from: selectedDate?.from ? format(selectedDate.from, 'dd-MM-yyyy') : null,
      to: selectedDate?.to ? format(selectedDate.to, 'dd-MM-yyyy') : null
    });
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant='outline'
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !value.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {value.from ? (
              value.to ? (
                <>
                  {value.from} - {value.to}
                </>
              ) : (
                value.from
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={
              value.from
                ? parse(value.from, 'dd-MM-yyyy', new Date())
                : undefined
            }
            selected={{
              from: value.from
                ? parse(value.from, 'dd-MM-yyyy', new Date())
                : undefined,
              to: value.to
                ? parse(value.to, 'dd-MM-yyyy', new Date())
                : undefined
            }}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
