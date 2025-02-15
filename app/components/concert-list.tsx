'use client'

import { useEffect, useState, useCallback } from 'react'
import { Concert } from '@prisma/client'
import { Switch } from '@/app/components/ui/switch'
import { Button } from '@/app/components/ui/button'
import { useToast } from '@/app/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import { FileDown } from 'lucide-react'

export function ConcertList() {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchConcerts = useCallback(async () => {
    try {
      const response = await fetch('/api/concerts')
      if (!response.ok) throw new Error('Failed to fetch concerts')
      const data = await response.json()
      setConcerts(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load concerts',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchConcerts()
  }, [fetchConcerts])

  async function toggleActive(concertId: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/concerts/${concertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) throw new Error('Failed to update concert')
      
      setConcerts(concerts.map(concert => 
        concert.id === concertId ? { ...concert, isActive } : concert
      ))

      toast({
        title: 'Success',
        description: `Concert ${isActive ? 'activated' : 'deactivated'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update concert status',
        variant: 'destructive',
      })
    }
  }

  const downloadReport = async (concertId: string, concertName: string) => {
    try {
      const response = await fetch(`/api/concerts/${concertId}/report`)
      if (!response.ok) throw new Error('Failed to generate report')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${concertName.toLowerCase().replace(/\s+/g, '-')}-report.csv`
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
        title: 'Error',
        description: 'Failed to download report',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return <div>Loading concerts...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Concerts</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[150px]">Created</TableHead>
            <TableHead className="w-[250px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {concerts.map((concert) => (
            <TableRow key={concert.id}>
              <TableCell>{concert.name}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Switch
                    checked={concert.isActive}
                    onCheckedChange={(checked: boolean) => toggleActive(concert.id, checked)}
                  />
                </div>
              </TableCell>
              <TableCell>
                {new Date(concert.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(concert.id, !concert.isActive)}
                  >
                    {concert.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReport(concert.id, concert.name)}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 