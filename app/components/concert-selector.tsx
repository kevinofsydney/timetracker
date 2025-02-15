'use client'

import { useEffect, useState } from 'react'
import { Concert } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { useToast } from '@/app/components/ui/use-toast'

interface ConcertSelectorProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ConcertSelector({ value, onChange, disabled }: ConcertSelectorProps) {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchConcerts() {
      try {
        const response = await fetch('/api/concerts?active=true')
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
    }

    fetchConcerts()
  }, [toast])

  if (isLoading) {
    return <div>Loading concerts...</div>
  }

  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={disabled || concerts.length === 0}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a concert" />
      </SelectTrigger>
      <SelectContent>
        {concerts.map((concert) => (
          <SelectItem key={concert.id} value={concert.id}>
            {concert.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 