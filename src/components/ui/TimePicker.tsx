'use client';

import * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Clock, XCircleIcon } from 'lucide-react';

interface TimePickerProps {
  value?: string;
  onChange: (value: string | undefined) => void; // ✅ Updated to allow undefined
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [selectedHour, setSelectedHour] = React.useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = React.useState<number | null>(
    null
  );
  const [selectedAMPM, setSelectedAMPM] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const ampmOptions = ['AM', 'PM'];

  React.useEffect(() => {
    if (value) {
      const [time, ampm] = value.split(' ');
      const [hour, minute] = time.split(':').map(Number);
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setSelectedAMPM(ampm);
    } else {
      setSelectedHour(null);
      setSelectedMinute(null);
      setSelectedAMPM(null);
    }
  }, [value]);

  const handleTimeChange = (
    type: 'hour' | 'minute' | 'ampm',
    newValue: number | string
  ) => {
    let newHour = selectedHour;
    let newMinute = selectedMinute;
    let newAMPM = selectedAMPM;

    if (type === 'hour') newHour = newValue as number;
    else if (type === 'minute') newMinute = newValue as number;
    else newAMPM = newValue as string;

    setSelectedHour(newHour);
    setSelectedMinute(newMinute);
    setSelectedAMPM(newAMPM);

    if (newHour !== null && newMinute !== null && newAMPM) {
      const formattedTime = `${newHour}:${newMinute.toString().padStart(2, '0')} ${newAMPM}`;
      onChange(formattedTime);
    }
  };

  const handleClear = () => {
    setSelectedHour(null);
    setSelectedMinute(null);
    setSelectedAMPM(null);
    onChange(undefined);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className='relative w-full'>
          <Button
            type='button'
            variant='outline'
            className='w-full justify-between pr-10'
          >
            {selectedHour !== null && selectedMinute !== null && selectedAMPM
              ? `${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${selectedAMPM}`
              : 'Select Time'}
            <Clock className='ml-2 h-4 w-4' />
          </Button>
          {value && (
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700'
              onClick={handleClear}
            >
              <XCircleIcon className='h-5 w-5' />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <div className='flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0'>
          {/* Hours Selection */}
          <ScrollArea className='w-64 sm:w-auto'>
            <div className='flex p-2 sm:flex-col'>
              {hours.map((hour) => (
                <Button
                  type='button'
                  key={hour}
                  size='icon'
                  variant={selectedHour === hour ? 'default' : 'ghost'}
                  className='aspect-square shrink-0 sm:w-full'
                  onClick={() => handleTimeChange('hour', hour)}
                >
                  {hour}
                </Button>
              ))}
            </div>
            <ScrollBar orientation='horizontal' className='sm:hidden' />
          </ScrollArea>

          {/* Minutes Selection */}
          <ScrollArea className='w-64 sm:w-auto'>
            <div className='flex p-2 sm:flex-col'>
              {minutes.map((minute) => (
                <Button
                  type='button'
                  key={minute}
                  size='icon'
                  variant={selectedMinute === minute ? 'default' : 'ghost'}
                  className='aspect-square shrink-0 sm:w-full'
                  onClick={() => handleTimeChange('minute', minute)}
                >
                  {minute.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
            <ScrollBar orientation='horizontal' className='sm:hidden' />
          </ScrollArea>

          {/* AM/PM Selection */}
          <ScrollArea>
            <div className='flex p-2 sm:flex-col'>
              {ampmOptions.map((ampm) => (
                <Button
                  type='button'
                  key={ampm}
                  size='icon'
                  variant={selectedAMPM === ampm ? 'default' : 'ghost'}
                  className='aspect-square shrink-0 sm:w-full'
                  onClick={() => handleTimeChange('ampm', ampm)}
                >
                  {ampm}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
