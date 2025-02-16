'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, differenceInHours, differenceInMinutes } from 'date-fns'
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/app/components/ui/button'
import { Calendar } from '@/app/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { useToast } from '@/app/components/ui/use-toast'
import { ConcertSelector } from '@/app/components/concert-selector'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { DateTimePicker } from "@/app/components/ui/date-time-picker"
import { Card, CardContent } from "@/app/components/ui/card"
import { Alert, AlertDescription } from "@/app/components/ui/alert"

const formSchema = z.object({
  concertId: z.string().min(1, 'Please select a concert'),
  shiftType: z.enum(['STANDARD', 'SUNDAY', 'EMERGENCY', 'OVERNIGHT']),
  clockIn: z.date({
    required_error: 'Please select a clock in time',
  }),
  clockOut: z.date({
    required_error: 'Please select a clock out time',
  }),
}).refine(data => data.clockOut > data.clockIn, {
  message: "Clock out time must be after clock in time",
  path: ["clockOut"],
}).refine(data => {
  const minutes = differenceInMinutes(data.clockOut, data.clockIn)
  return minutes <= 24 * 60 // 24 hours in minutes
}, {
  message: "Shift duration cannot exceed 24 hours",
  path: ["clockOut"],
});

interface AddShiftFormProps {
  onSuccess?: () => void
}

export function AddShiftForm({ onSuccess }: AddShiftFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const addShiftMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || errorData.error || 'Failed to add shift')
      }

      const data = await response.json()
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] })
      toast({
        title: 'Success',
        description: 'Shift added successfully',
      })
      form.reset()
      onSuccess?.()
    },
    onError: (error) => {
      console.error('Add shift error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add shift',
      })
    },
  })

  // Calculate hours worked when both dates are selected
  const clockIn = form.watch('clockIn')
  const clockOut = form.watch('clockOut')
  
  const calculateHours = () => {
    if (!clockIn || !clockOut) return null
    
    const totalMinutes = differenceInMinutes(clockOut, clockIn)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return {
      raw: `${hours}h ${minutes}m`,
      totalMinutes
    }
  }

  const hoursWorked = calculateHours()
  const isShiftTooLong = Boolean(hoursWorked?.totalMinutes && hoursWorked.totalMinutes > 24 * 60)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => addShiftMutation.mutate(values))} className="space-y-4">
        <FormField
          control={form.control}
          name="concertId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Concert</FormLabel>
              <FormControl>
                <ConcertSelector
                  value={field.value}
                  onChange={field.onChange}
                  disabled={addShiftMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shiftType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={addShiftMutation.isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="SUNDAY">Sunday</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                  <SelectItem value="OVERNIGHT">Overnight</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="clockIn"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Clock In</FormLabel>
                <FormControl>
                  <DateTimePicker
                    date={field.value}
                    setDate={field.onChange}
                    disabled={addShiftMutation.isPending}
                    otherDate={form.watch('clockOut')}
                    isClockOut={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clockOut"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Clock Out</FormLabel>
                <FormControl>
                  <DateTimePicker
                    date={field.value}
                    setDate={field.onChange}
                    disabled={addShiftMutation.isPending}
                    otherDate={form.watch('clockIn')}
                    isClockOut={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {hoursWorked && (
          <Card className={cn("mt-4", isShiftTooLong && "border-destructive")}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total Hours:</span>
                <span className={cn("font-medium text-sm", isShiftTooLong && "text-destructive")}>
                  {hoursWorked.raw}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {isShiftTooLong && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Shift duration cannot exceed 24 hours. Please adjust your times.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          disabled={addShiftMutation.isPending || isShiftTooLong}
        >
          Add Shift
        </Button>
      </form>
    </Form>
  )
} 