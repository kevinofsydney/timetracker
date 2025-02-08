'use client'

import { useSession, signOut } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'

import { TimeTracker } from '@/app/components/time-tracker'
import TimeEntries from '@/app/components/time-entries'
import { AdminDashboard } from '@/app/components/admin-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { LogOut } from 'lucide-react'

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
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        <AdminDashboard />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Translator Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

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