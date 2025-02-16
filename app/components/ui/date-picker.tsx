'use client'

import * as React from 'react'
import { format, subMonths, isAfter, isBefore, isToday } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/app/components/ui/button'
import { Calendar } from '@/app/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { Input } from '@/app/components/ui/input'

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Calculate the date one month ago
  const oneMonthAgo = subMonths(new Date(), 1)
  
  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    const isInFuture = isAfter(date, new Date()) && !isToday(date)
    const isTooOld = isBefore(date, oneMonthAgo)
    return isInFuture || isTooOld
  }

  return (
    <div className="grid gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              onSelect?.(newDate)
              setIsOpen(false)
            }}
            disabled={isDateDisabled}
            initialFocus
            fromDate={oneMonthAgo}
            toDate={new Date()}
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Input 
          type="text" 
          value={format(date, 'PPP')} 
          readOnly 
          className="text-center"
        />
      )}
    </div>
  )
} 