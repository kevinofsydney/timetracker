'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'

import { TimeTracker } from '@/app/components/time-tracker'
import TimeEntries from '@/app/components/time-entries'
import { AdminDashboard } from '@/app/components/admin-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

export function Dashboard() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const { data: activeEntry } = useQuery({
    queryKey: ['active-entry'],
    queryFn: async () => {
      const response = await fetch('/api/time-entries/active')
      if (!response.ok) {
        throw new Error('Failed to fetch active entry')
      }
      return response.json()
    },
  })

  if (isAdmin) {
    return <AdminDashboard />
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Time Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeTracker activeEntry={activeEntry} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeEntries />
        </CardContent>
      </Card>
    </div>
  )
} 