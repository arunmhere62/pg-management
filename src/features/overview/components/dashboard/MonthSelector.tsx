import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number, year: number) => void;
}

export function MonthSelector({
  selectedMonth,
  selectedYear,
  onMonthChange
}: MonthSelectorProps) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const handlePreviousMonth = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;

    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    onMonthChange(newMonth, newYear);
  };

  const handleNextMonth = () => {
    let newMonth = selectedMonth + 1;
    let newYear = selectedYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    onMonthChange(newMonth, newYear);
  };

  const handleMonthSelect = (value: string) => {
    onMonthChange(parseInt(value), selectedYear);
  };

  const handleYearSelect = (value: string) => {
    onMonthChange(selectedMonth, parseInt(value));
  };

  // Generate years (current year - 2 to current year + 2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className='flex flex-wrap gap-2 sm:items-center sm:justify-end'>
      <div className='flex items-center'>
        <Button
          variant='outline'
          size='sm'
          className='h-8 w-8 p-0'
          onClick={handlePreviousMonth}
          aria-label='Previous month'
        >
          <ChevronLeft className='h-3 w-3 sm:h-4 sm:w-4' />
        </Button>

        <div className='flex items-center gap-1 px-1 sm:gap-2'>
          <Select
            value={selectedMonth.toString()}
            onValueChange={handleMonthSelect}
          >
            <SelectTrigger className='h-8 w-[90px] text-xs sm:w-[130px] sm:text-sm'>
              <SelectValue placeholder='Month' />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearSelect}
          >
            <SelectTrigger className='h-8 w-[70px] text-xs sm:w-[100px] sm:text-sm'>
              <SelectValue placeholder='Year' />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant='outline'
          size='sm'
          className='h-8 w-8 p-0'
          onClick={handleNextMonth}
          aria-label='Next month'
        >
          <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4' />
        </Button>
      </div>
    </div>
  );
}
