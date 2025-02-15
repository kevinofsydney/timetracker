"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
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
}

export function DateTimePicker({ date, setDate, disabled }: DateTimePickerProps) {
  // Generate minute options in 5-minute increments
  const minuteOptions = []
  for (let i = 0; i < 60; i += 5) {
    minuteOptions.push(i.toString().padStart(2, "0"))
  }

  const hourOptions = []
  for (let i = 0; i < 24; i++) {
    hourOptions.push(i.toString().padStart(2, "0"))
  }

  return (
    <Popover>
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
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              const newDate = new Date(selectedDate)
              if (date) {
                // Preserve the time when changing the date
                newDate.setHours(date.getHours())
                newDate.setMinutes(date.getMinutes())
              }
              setDate(newDate)
            }
          }}
          initialFocus
          disabled={(date) => date > new Date()}
          weekStartsOn={1} // Start week on Monday
          classNames={{
            head_cell: "font-normal text-muted-foreground",
            cell: cn(
              "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            ),
            day: cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
            ),
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            nav_button: cn(
              "border-0 hover:opacity-100 opacity-50"
            ),
          }}
        />
        <div className="border-t border-border p-3 space-y-3">
          <div className="flex gap-2">
            <Select
              value={date ? date.getHours().toString().padStart(2, "0") : ""}
              onValueChange={(hour) => {
                if (date) {
                  const newDate = new Date(date)
                  newDate.setHours(parseInt(hour))
                  setDate(newDate)
                } else {
                  const newDate = new Date()
                  newDate.setHours(parseInt(hour))
                  setDate(newDate)
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
              value={date ? (Math.floor(date.getMinutes() / 5) * 5).toString().padStart(2, "0") : ""}
              onValueChange={(minute) => {
                if (date) {
                  const newDate = new Date(date)
                  newDate.setMinutes(parseInt(minute))
                  setDate(newDate)
                } else {
                  const newDate = new Date()
                  newDate.setMinutes(parseInt(minute))
                  setDate(newDate)
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
        </div>
      </PopoverContent>
    </Popover>
  )
} 