'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

import { Button } from '@/app/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import { useToast } from '@/app/components/ui/use-toast'
import { Input } from '@/app/components/ui/input'

interface TimeEntry {
  id: string
  userId: string
  user: {
    name: string
    email: string
  }
  shiftType: 'STANDARD' | 'SUNDAY' | 'EMERGENCY' | 'OVERNIGHT'
  clockIn: string
  clockOut: string | null
  rawHours: number | null
  roundedHours: number | null
  edited: boolean
  editedBy: string | null
  editReason: string | null
}

export function AdminTimeEntries() {
  const { toast } = useToast()
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )

  const { data: entries, isLoading } = useQuery<TimeEntry[]>({
    queryKey: ['admin-time-entries', startDate, endDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/time-entries?start=${startDate}&end=${endDate}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch time entries')
      }
      return response.json()
    },
  })

  const downloadReport = async () => {
    try {
      const response = await fetch(
        `/api/admin/reports/download?start=${startDate}&end=${endDate}`
      )
      if (!response.ok) {
        throw new Error('Failed to download report')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `timesheet-report-${startDate}-to-${endDate}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'Report downloaded successfully',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to download report',
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="start-date">Start Date:</label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="end-date">End Date:</label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button onClick={downloadReport}>Download Report</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Translator</TableHead>
            <TableHead>Shift Type</TableHead>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead>Raw Hours</TableHead>
            <TableHead>Rounded Hours</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries?.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.user.name}</TableCell>
              <TableCell>{entry.shiftType}</TableCell>
              <TableCell>{format(new Date(entry.clockIn), 'PPp')}</TableCell>
              <TableCell>
                {entry.clockOut
                  ? format(new Date(entry.clockOut), 'PPp')
                  : 'Active'}
              </TableCell>
              <TableCell>
                {entry.rawHours ? entry.rawHours.toFixed(2) : '-'}
              </TableCell>
              <TableCell>
                {entry.roundedHours ? entry.roundedHours.toFixed(2) : '-'}
              </TableCell>
              <TableCell>
                {entry.edited ? (
                  <span title={`Edited by ${entry.editedBy}: ${entry.editReason}`}>
                    Edited
                  </span>
                ) : (
                  'Original'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 