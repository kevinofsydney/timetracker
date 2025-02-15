'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'

import { Button } from '@/app/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { useToast } from '@/app/components/ui/use-toast'
import { ConcertSelector } from '@/app/components/concert-selector'

interface TimeEntry {
  id: string
  userId: string
  shiftType: 'STANDARD' | 'SUNDAY' | 'EMERGENCY' | 'OVERNIGHT'
  clockIn: string
  clockOut: string | null
  concert: {
    name: string
  }
}

interface TimeTrackerProps {
  activeEntry?: TimeEntry | null
}

interface ApiError {
  message: string
  status?: number
}

export function TimeTracker({ activeEntry }: TimeTrackerProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedConcert, setSelectedConcert] = useState<string>('')
  const [selectedShiftType, setSelectedShiftType] = useState<TimeEntry['shiftType']>('STANDARD')

  const handleError = (error: unknown) => {
    const message = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred'
    
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    })
  }

  const clockInMutation = useMutation({
    mutationFn: async () => {
      if (!selectedConcert) {
        throw new Error('Please select a concert')
      }

      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          concertId: selectedConcert,
          shiftType: selectedShiftType,
          clockIn: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to clock in')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-entry'] })
      queryClient.invalidateQueries({ queryKey: ['time-entries'] })
      toast({
        title: 'Success',
        description: 'Successfully clocked in',
      })
      setSelectedConcert('')
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to clock in',
        variant: 'destructive',
      })
    },
  })

  const clockOutMutation = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ['time-entries'] })
      toast({
        title: 'Success',
        description: 'Successfully clocked out',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to clock out',
        variant: 'destructive',
      })
    },
  })

  if (!session) {
    return null
  }

  if (activeEntry) {
    return (
      <div className="space-y-4">
        <p>
          Currently working on: <strong>{activeEntry.concert.name}</strong>
        </p>
        <p>
          Clocked in at:{' '}
          <strong>
            {new Date(activeEntry.clockIn).toLocaleTimeString()}
          </strong>
        </p>
        <Button 
          onClick={() => clockOutMutation.mutate()}
          disabled={clockOutMutation.isPending}
        >
          Clock Out
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <ConcertSelector
          value={selectedConcert}
          onChange={setSelectedConcert}
          disabled={clockInMutation.isPending}
        />
        <Select
          value={selectedShiftType}
          onValueChange={(value: TimeEntry['shiftType']) => setSelectedShiftType(value)}
          disabled={clockInMutation.isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select shift type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STANDARD">Standard</SelectItem>
            <SelectItem value="SUNDAY">Sunday</SelectItem>
            <SelectItem value="EMERGENCY">Emergency</SelectItem>
            <SelectItem value="OVERNIGHT">Overnight</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={() => clockInMutation.mutate()}
        disabled={!selectedConcert || clockInMutation.isPending}
      >
        Clock In
      </Button>
    </div>
  )
} 