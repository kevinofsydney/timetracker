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
import { AddShiftForm } from '@/app/components/add-shift-form'
import { DeleteShiftDialog } from '@/app/components/delete-shift-dialog'
import { useSession } from 'next-auth/react'

type ShiftType = 'STANDARD' | 'SUNDAY' | 'EMERGENCY' | 'OVERNIGHT'

interface TimeEntry {
  id: string
  clockIn: string
  clockOut: string | null
  rawHours: number | null
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
  const { data: session } = useSession()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedConcert, setSelectedConcert] = useState<string>('')
  const [isClockInDialogOpen, setIsClockInDialogOpen] = useState(false)
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftType>('STANDARD')
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false)

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
        <h2 className="text-xl font-semibold">Recent Time Entries</h2>
        <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
          <DialogTrigger asChild>
            <Button>Add a Shift</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Past Shift</DialogTitle>
            </DialogHeader>
            <AddShiftForm onSuccess={() => setIsAddShiftOpen(false)} />
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
            <TableHead className="w-[50px]"></TableHead>
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
                {entry.rawHours ? entry.rawHours.toFixed(2) : '-'}
              </TableCell>
              <TableCell>
                {entry.clockOut ? 'Completed' : 'Active'}
              </TableCell>
              <TableCell>
                {entry.clockOut && (
                  <DeleteShiftDialog
                    shiftId={entry.id}
                    clockIn={new Date(entry.clockIn)}
                    clockOut={new Date(entry.clockOut)}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 