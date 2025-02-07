'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

interface TimeEntry {
  id: string
  userId: string
  shiftType: 'STANDARD' | 'SUNDAY' | 'EMERGENCY' | 'OVERNIGHT'
  clockIn: string
  clockOut: string | null
}

interface TimeTrackerProps {
  activeEntry: TimeEntry | null
}

export function TimeTracker({ activeEntry }: TimeTrackerProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [shiftType, setShiftType] = useState<TimeEntry['shiftType']>('STANDARD')

  const clockIn = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shiftType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to clock in')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-entry'] })
      toast({
        title: 'Success',
        description: 'You have successfully clocked in',
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to clock in. Please try again.',
      })
    },
  })

  const clockOut = useMutation({
    mutationFn: async () => {
      if (!activeEntry) return

      const response = await fetch(`/api/time-entries/${activeEntry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clockOut: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to clock out')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-entry'] })
      toast({
        title: 'Success',
        description: 'You have successfully clocked out',
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to clock out. Please try again.',
      })
    },
  })

  if (!session) {
    return null
  }

  if (activeEntry) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current shift</p>
            <p className="text-sm text-muted-foreground">
              Started at {format(new Date(activeEntry.clockIn), 'h:mm a')}
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => clockOut.mutate()}
            disabled={clockOut.isPending}
          >
            {clockOut.isPending ? 'Clocking out...' : 'Clock out'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Select
        value={shiftType}
        onValueChange={(value) => setShiftType(value as TimeEntry['shiftType'])}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select shift type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="STANDARD">Standard</SelectItem>
          <SelectItem value="SUNDAY">Sunday</SelectItem>
          <SelectItem value="EMERGENCY">Emergency</SelectItem>
          <SelectItem value="OVERNIGHT">Overnight</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={() => clockIn.mutate()} disabled={clockIn.isPending}>
        {clockIn.isPending ? 'Clocking in...' : 'Clock in'}
      </Button>
    </div>
  )
} 