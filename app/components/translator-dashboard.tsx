'use client'

import { TimeTracker } from '@/app/components/time-tracker'
import TimeEntries from '@/app/components/time-entries'
import { AddShiftForm } from '@/app/components/add-shift-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'

export function TranslatorDashboard() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Current Shift</TabsTrigger>
          <TabsTrigger value="add">Add Past Shift</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Time Tracker</CardTitle>
              <CardDescription>Track your current shift</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeTracker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Past Shift</CardTitle>
              <CardDescription>Record a previous shift</CardDescription>
            </CardHeader>
            <CardContent>
              <AddShiftForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Shift History</CardTitle>
              <CardDescription>View your past shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeEntries />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 