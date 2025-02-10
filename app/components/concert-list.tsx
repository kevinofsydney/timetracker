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
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {concerts.map((concert) => (
            <TableRow key={concert.id}>
              <TableCell>{concert.name}</TableCell>
              <TableCell>
                <Switch
                  checked={concert.isActive}
                  onCheckedChange={(checked: boolean) => toggleActive(concert.id, checked)}
                />
              </TableCell>
              <TableCell>
                {new Date(concert.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(concert.id, !concert.isActive)}
                >
                  {concert.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 