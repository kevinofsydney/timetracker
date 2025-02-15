'use client'

import { TimeTracker } from '@/app/components/time-tracker'
import TimeEntries from '@/app/components/time-entries'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'

export function TranslatorDashboard() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Time Tracker</CardTitle>
          <CardDescription>Track your current shift</CardDescription>
        </CardHeader>
        <CardContent>
          <TimeTracker />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shift History</CardTitle>
          <CardDescription>View and manage your shifts</CardDescription>
        </CardHeader>
        <CardContent>
          <TimeEntries />
        </CardContent>
      </Card>
    </div>
  )
} 