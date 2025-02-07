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
  date: string
  hours: number
  description: string
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
              <TableHead>Date</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry: TimeEntry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), 'PPP')}</TableCell>
                <TableCell>{entry.hours}</TableCell>
                <TableCell>{entry.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 