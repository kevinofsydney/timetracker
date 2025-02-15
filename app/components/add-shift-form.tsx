'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
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
        body: JSON.stringify({
          concertId: values.concertId,
          shiftType: values.shiftType,
          clockIn: values.clockIn.toISOString(),
          clockOut: values.clockOut.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add shift')
      }

      return response.json()
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
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add shift',
        variant: 'destructive',
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addShiftMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    clockInDate={form.watch('clockIn')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={addShiftMutation.isPending}>
          Add Shift
        </Button>
      </form>
    </Form>
  )
} 