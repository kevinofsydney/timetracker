'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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

export function AdminDashboard() {
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
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>
            Download a CSV report of time entries for a specific date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="grid gap-2">
              <label htmlFor="start-date">Start Date</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-md border px-3 py-2"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="end-date">End Date</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-md border px-3 py-2"
              />
            </div>
            <Button onClick={downloadReport}>Download Report</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>View and manage all time entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Translator</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Shift Type</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries?.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.user.name}</TableCell>
                  <TableCell>
                    {format(new Date(entry.clockIn), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="capitalize">
                    {entry.shiftType.toLowerCase()}
                  </TableCell>
                  <TableCell>
                    {format(new Date(entry.clockIn), 'h:mm a')}
                  </TableCell>
                  <TableCell>
                    {entry.clockOut
                      ? format(new Date(entry.clockOut), 'h:mm a')
                      : 'Active'}
                  </TableCell>
                  <TableCell>
                    {entry.roundedHours ? `${entry.roundedHours} hrs` : '-'}
                  </TableCell>
                  <TableCell>
                    {entry.edited ? (
                      <span className="text-sm text-yellow-600">Edited</span>
                    ) : (
                      <span className="text-sm text-green-600">Original</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 