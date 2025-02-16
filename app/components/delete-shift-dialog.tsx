'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog'
import { Button } from '@/app/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useToast } from '@/app/components/ui/use-toast'

interface DeleteShiftDialogProps {
  shiftId: string
  clockIn: Date
  clockOut: Date
}

export function DeleteShiftDialog({ shiftId, clockIn, clockOut }: DeleteShiftDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const deleteShiftMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/time-entries/${shiftId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete shift')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] })
      toast({
        title: 'Success',
        description: 'Shift deleted successfully',
      })
      setOpen(false)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete shift',
      })
    },
  })

  const formattedClockIn = format(clockIn, 'PPp')
  const formattedClockOut = format(clockOut, 'PPp')

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Shift</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this shift?
            <div className="mt-2 text-sm">
              <p>Clock In: {formattedClockIn}</p>
              <p>Clock Out: {formattedClockOut}</p>
            </div>
            <p className="mt-2">This action cannot be undone.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteShiftMutation.mutate()}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 