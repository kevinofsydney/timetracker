"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Check, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
import { Calendar } from "@/app/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
  clockInDate?: Date // Add this to get the clock-in date for reference
}

export function DateTimePicker({ 
  date, 
  setDate, 
  disabled,
  clockInDate 
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [tempDate, setTempDate] = React.useState<Date | undefined>(date)

  // When clockInDate changes and this is a clock-out picker, set the default date
  React.useEffect(() => {
    if (clockInDate && !date) {
      const defaultDate = new Date(clockInDate)
      defaultDate.setHours(clockInDate.getHours() + 1) // Default to 1 hour after clock in
      setTempDate(defaultDate)
    }
  }, [clockInDate, date])

  const minuteOptions = []
  for (let i = 0; i < 60; i += 5) {
    minuteOptions.push(i.toString().padStart(2, "0"))
  }

  const hourOptions = []
  for (let i = 0; i < 24; i++) {
    hourOptions.push(i.toString().padStart(2, "0"))
  }

  const handleDone = () => {
    setDate(tempDate)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempDate(date)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPp") : <span>Pick date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={tempDate}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                const newDate = new Date(selectedDate)
                if (tempDate) {
                  newDate.setHours(tempDate.getHours())
                  newDate.setMinutes(tempDate.getMinutes())
                }
                setTempDate(newDate)
              }
            }}
            initialFocus
            disabled={(date) => date > new Date()}
            weekStartsOn={1}
            classNames={{
              head_cell: "font-normal text-muted-foreground",
              cell: cn(
                "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              ),
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md transition-all",
                "hover:bg-accent hover:text-accent-foreground"
              ),
              day_selected: cn(
                "bg-primary text-primary-foreground",
                "hover:bg-primary hover:text-primary-foreground",
                "focus:bg-primary focus:text-primary-foreground",
                "ring-2 ring-primary ring-offset-2 ring-offset-background",
                "font-semibold"
              ),
              day_today: "bg-accent text-accent-foreground",
              day_outside: cn(
                "text-muted-foreground/40 opacity-25 hover:bg-transparent hover:text-muted-foreground/40",
                "pointer-events-none"
              ),
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
              nav_button: cn(
                "border-0 hover:opacity-100 opacity-50"
              ),
            }}
          />
        </div>
        <div className="border-t border-border p-3 space-y-3">
          <div className="flex gap-2">
            <Select
              value={tempDate ? tempDate.getHours().toString().padStart(2, "0") : ""}
              onValueChange={(hour) => {
                if (tempDate) {
                  const newDate = new Date(tempDate)
                  newDate.setHours(parseInt(hour))
                  setTempDate(newDate)
                } else {
                  const newDate = new Date()
                  newDate.setHours(parseInt(hour))
                  setTempDate(newDate)
                }
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hourOptions.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={tempDate ? (Math.floor(tempDate.getMinutes() / 5) * 5).toString().padStart(2, "0") : ""}
              onValueChange={(minute) => {
                if (tempDate) {
                  const newDate = new Date(tempDate)
                  newDate.setMinutes(parseInt(minute))
                  setTempDate(newDate)
                } else {
                  const newDate = new Date()
                  newDate.setMinutes(parseInt(minute))
                  setTempDate(newDate)
                }
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {minuteOptions.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    :{minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleDone}
            >
              <Check className="h-4 w-4 mr-1" />
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 