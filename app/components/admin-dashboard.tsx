'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'

import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import { useToast } from '@/app/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { ConcertManagement } from '@/app/components/concert-management'
import { ConcertList } from '@/app/components/concert-list'

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
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <Tabs defaultValue="manage" className="w-full">
        <TabsList>
          <TabsTrigger value="manage">Manage Concerts</TabsTrigger>
          <TabsTrigger value="list">Concert List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage">
          <ConcertManagement />
        </TabsContent>
        
        <TabsContent value="list">
          <ConcertList />
        </TabsContent>
      </Tabs>
    </div>
  )
} 