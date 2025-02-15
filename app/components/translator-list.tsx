'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, FileDown, Plus, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/app/components/ui/use-toast'
import { Button } from '@/app/components/ui/button'
import { Calendar } from '@/app/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'

interface Translator {
  id: string
  name: string
  email: string
}

const createTranslatorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type CreateTranslatorForm = z.infer<typeof createTranslatorSchema>

export function TranslatorList() {
  const { toast } = useToast()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const form = useForm<CreateTranslatorForm>({
    resolver: zodResolver(createTranslatorSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const { data: translators, isLoading } = useQuery<Translator[]>({
    queryKey: ['translators'],
    queryFn: async () => {
      const response = await fetch('/api/translators')
      if (!response.ok) throw new Error('Failed to fetch translators')
      return response.json()
    },
  })

  const downloadReport = async (translatorId: string, translatorName: string) => {
    try {
      if (!startDate || !endDate) {
        toast({
          title: 'Error',
          description: 'Please select both start and end dates',
          variant: 'destructive',
        })
        return
      }

      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      })

      const response = await fetch(`/api/translators/${translatorId}/report?${params}`)
      if (!response.ok) throw new Error('Failed to generate report')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${translatorName.toLowerCase().replace(/\s+/g, '-')}-report.csv`
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

  const createTranslatorMutation = useMutation({
    mutationFn: async (data: CreateTranslatorForm) => {
      const response = await fetch('/api/translators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to create translator')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translators'] })
      toast({
        title: 'Success',
        description: 'Translator created successfully',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const deleteTranslatorMutation = useMutation({
    mutationFn: async (translatorId: string) => {
      const response = await fetch(`/api/translators/${translatorId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to delete translator')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translators'] })
      toast({
        title: 'Success',
        description: 'Translator deleted successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: CreateTranslatorForm) => {
    createTranslatorMutation.mutate(data)
  }

  if (isLoading) {
    return <div>Loading translators...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Translators</h2>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {startDate ? format(startDate, 'PPP') : 'Start Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {endDate ? format(endDate, 'PPP') : 'End Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Translator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Translator</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create Translator</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[250px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {translators?.map((translator) => (
            <TableRow key={translator.id}>
              <TableCell>{translator.name}</TableCell>
              <TableCell>{translator.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReport(translator.id, translator.name)}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Translator</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {translator.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTranslatorMutation.mutate(translator.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 