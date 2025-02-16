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
import { useToast } from '@/app/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { ConcertManagement } from '@/app/components/concert-management'
import { ConcertList } from '@/app/components/concert-list'
import { TranslatorList } from '@/app/components/translator-list'
import { AdminTimeEntries } from '@/app/components/admin-time-entries'

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="time-entries" className="w-full">
        <TabsList>
          <TabsTrigger value="time-entries">Time Entries</TabsTrigger>
          <TabsTrigger value="concerts">Concerts</TabsTrigger>
          <TabsTrigger value="translators">Translators</TabsTrigger>
          <TabsTrigger value="add">Add a Concert</TabsTrigger>
        </TabsList>
        
        <TabsContent value="time-entries">
          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>View and manage all time entries</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminTimeEntries />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concerts">
          <ConcertList />
        </TabsContent>
        
        <TabsContent value="translators">
          <TranslatorList />
        </TabsContent>

        <TabsContent value="add">
          <ConcertManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
} 