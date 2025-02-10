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
} from '@/app/components/ui/table'
import { useToast } from '@/app/components/ui/use-toast'

interface TimeEntry {
  id: string
  clockIn: string
  clockOut: string | null
  shiftType: 'STANDARD' | 'SUNDAY' | 'EMERGENCY' | 'OVERNIGHT'
  rawHours: number | null
  roundedHours: number | null
  edited: boolean
  editReason?: string
  concert: string
}

export default function TimeEntries() {
  const { data: session } = useSession()
  const { toast } = useToast()

  const { data: timeEntries, isLoading } = useQuery<TimeEntry[]>({
    queryKey: ['time-entries'],
    queryFn: async () => {
      const response = await fetch('/api/time-entries')
      if (!response.ok) {
        throw new Error('Failed to fetch time entries')
      }
      return response.json()
    },
    enabled: !!session
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!timeEntries || timeEntries.length === 0) {
    return <div>No time entries found.</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Concert</TableHead>
              <TableHead>Shift Type</TableHead>
              <TableHead>Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry: TimeEntry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.clockIn), 'PPP p')}</TableCell>
                <TableCell>
                  {entry.clockOut ? format(new Date(entry.clockOut), 'PPP p') : 'Active'}
                </TableCell>
                <TableCell>{entry.concert}</TableCell>
                <TableCell>{entry.shiftType}</TableCell>
                <TableCell>{entry.roundedHours ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 