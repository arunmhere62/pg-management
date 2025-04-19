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
    <div className='mb-4 flex items-center space-x-2'>
      <Button
        variant='outline'
        size='icon'
        onClick={handlePreviousMonth}
        aria-label='Previous month'
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      <div className='flex items-center space-x-2'>
        <Select
          value={selectedMonth.toString()}
          onValueChange={handleMonthSelect}
        >
          <SelectTrigger className='w-[130px]'>
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
          <SelectTrigger className='w-[100px]'>
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
        size='icon'
        onClick={handleNextMonth}
        aria-label='Next month'
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
}
