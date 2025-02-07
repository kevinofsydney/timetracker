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

interface TimeEntry {
  id: string
  userId: string
  shiftType: 'STANDARD' | 'SUNDAY' | 'EMERGENCY' | 'OVERNIGHT'
  clockIn: string
  clockOut: string | null
  rawHours: number | null
  roundedHours: number | null
}

export function TimeEntries() {
  const { data: session } = useSession()

  const { data: entries, isLoading } = useQuery<TimeEntry[]>({
    queryKey: ['time-entries'],
    queryFn: async () => {
      const response = await fetch('/api/time-entries')
      if (!response.ok) {
        throw new Error('Failed to fetch time entries')
      }
      return response.json()
    },
  })

  if (!session) {
    return null
  }

  if (isLoading) {
    return <div>Loading...</div>
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
        {entries?.map((entry) => (
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