'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useToast } from '@/app/components/ui/use-toast'
import { Button } from '@/app/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'

type ShiftType = 'STANDARD' | 'SUNDAY' | 'EMERGENCY' | 'OVERNIGHT'

interface TimeEntry {
  id: string
  clockIn: string
  clockOut: string | null
  roundedHours: number | null
  concert: {
    name: string
  }
  shiftType: ShiftType
}

interface Concert {
  id: string
  name: string
  isActive: boolean
}

export default function TimeEntries() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedConcert, setSelectedConcert] = useState<string>('')
  const [isClockInDialogOpen, setIsClockInDialogOpen] = useState(false)
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftType>('STANDARD')

  const { data: entries, isLoading: isLoadingEntries } = useQuery<TimeEntry[]>({
    queryKey: ['time-entries'],
    queryFn: async () => {
      const response = await fetch('/api/time-entries')
      if (!response.ok) throw new Error('Failed to fetch time entries')
      return response.json()
    },
  })

  const { data: concerts, isLoading: isLoadingConcerts } = useQuery<Concert[]>({
    queryKey: ['active-concerts'],
    queryFn: async () => {
      const response = await fetch('/api/concerts?active=true')
      if (!response.ok) throw new Error('Failed to fetch concerts')
      return response.json()
    },
  })

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
          clockIn: new Date().toISOString(),
          concertId: selectedConcert,
          shiftType: selectedShiftType,
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
      setIsClockInDialogOpen(false)
      setSelectedConcert('')
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  if (isLoadingEntries || isLoadingConcerts) {
    return <div>Loading...</div>
  }

  const hasActiveConcerts = concerts && concerts.length > 0

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Time Entries</h2>
        <Dialog open={isClockInDialogOpen} onOpenChange={setIsClockInDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!hasActiveConcerts}>
              Clock In
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Shift</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Select value={selectedConcert} onValueChange={setSelectedConcert}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a concert" />
                </SelectTrigger>
                <SelectContent>
                  {concerts?.map((concert) => (
                    <SelectItem key={concert.id} value={concert.id}>
                      {concert.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={selectedShiftType} 
                onValueChange={(value: ShiftType) => setSelectedShiftType(value)}
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
              <Button 
                className="w-full" 
                onClick={() => clockInMutation.mutate()}
                disabled={!selectedConcert}
              >
                Start Shift
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Concert</TableHead>
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
              <TableCell>{entry.concert.name}</TableCell>
              <TableCell>{entry.shiftType}</TableCell>
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