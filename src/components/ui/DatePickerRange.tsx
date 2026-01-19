'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerWithRangeProps = {
  dateStart?: Date;
  dateEnd?: Date;
  onChange?: (dateStart: Date | undefined, dateEnd: Date | undefined) => void;
  className?: string;
};

export function DatePickerRange({
  className,
  dateStart,
  dateEnd,
  onChange,
}: DatePickerWithRangeProps) {
  const handleDateChange = (newDate: DateRange | undefined) => {
    if (newDate?.from && newDate?.to) {
      onChange?.(newDate.from, newDate.to);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !dateStart && !dateEnd && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateStart && dateEnd ? (
              <>
                {format(dateStart, 'LLL dd, y')} -{' '}
                {format(dateEnd, 'LLL dd, y')}
              </>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateStart}
            selected={
              dateStart && dateEnd
                ? { from: dateStart, to: dateEnd }
                : undefined
            }
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
