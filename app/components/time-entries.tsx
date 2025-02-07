'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

interface TimeEntry {
  id: string
  userId: string
  shiftType: 'STANDARD' | 'SUNDAY' | 'EMERGENCY' | 'OVERNIGHT'
  clockIn: string
  clockOut: string | null
  rawHours: number | null
  roundedHours: number | null
  user?: {
    name: string
    email: string
  }
}

export function TimeEntries() {
  const { data: session } = useSession()
  const { toast } = useToast()

  const { data: entries, isLoading, error } = useQuery<TimeEntry[]>({
    queryKey: ['time-entries'],
    queryFn: async () => {
      const response = await fetch('/api/time-entries')
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch time entries')
      }
      return response.json()
    },
    enabled: !!session,
    onError: (error: unknown) => {
      const message = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred'
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      })
    }
  })

  if (!session) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Loading time entries...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-sm text-destructive">Failed to load time entries</p>
      </div>
    )
  }

  if (!entries?.length) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">No time entries found</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Shift Type</TableHead>
          <TableHead>Clock In</TableHead>
          <TableHead>Clock Out</TableHead>
          <TableHead>Hours</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>
              {format(new Date(entry.clockIn), 'MMM d, yyyy')}
            </TableCell>
            <TableCell className="capitalize">
              {entry.shiftType.toLowerCase()}
            </TableCell>
            <TableCell>{format(new Date(entry.clockIn), 'h:mm a')}</TableCell>
            <TableCell>
              {entry.clockOut
                ? format(new Date(entry.clockOut), 'h:mm a')
                : 'Active'}
            </TableCell>
            <TableCell>
              {entry.roundedHours ? `${entry.roundedHours} hrs` : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 