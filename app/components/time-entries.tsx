'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useToast } from '@/app/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'

interface TimeEntry {
  id: string
  clockIn: string
  clockOut: string | null
  roundedHours: number | null
}

export default function TimeEntries() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: entries, isLoading, error } = useQuery<TimeEntry[]>({
    queryKey: ['time-entries'],
    queryFn: async () => {
      const response = await fetch('/api/time-entries')
      if (!response.ok) throw new Error('Failed to fetch time entries')
      return response.json()
    },
  })

  const clockInMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clockIn: new Date().toISOString(),
        }),
      })
      
      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        throw new Error(`Server response: ${text}`)
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to clock in')
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] })
      toast({
        title: 'Success',
        description: 'Successfully clocked in',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  if (error) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive">
        <h3 className="font-semibold">Error</h3>
        <p>{error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries?.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {format(new Date(entry.clockIn), 'PPp')}
              </TableCell>
              <TableCell>
                {entry.clockOut ? format(new Date(entry.clockOut), 'PPp') : '-'}
              </TableCell>
              <TableCell>
                {entry.roundedHours ?? '-'}
              </TableCell>
              <TableCell>
                {entry.clockOut ? 'Completed' : 'Active'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 