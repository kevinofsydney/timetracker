import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const createConcertSchema = z.object({
  name: z.string().min(1, 'Concert name is required'),
  isActive: z.boolean().default(true),
})

export const updateConcertSchema = z.object({
  name: z.string().min(1, 'Concert name is required').optional(),
  isActive: z.boolean().optional(),
})

export async function createConcert(data: z.infer<typeof createConcertSchema>) {
  return await prisma.concert.create({
    data,
  })
}

export async function updateConcert(id: string, data: z.infer<typeof updateConcertSchema>) {
  return await prisma.concert.update({
    where: { id },
    data,
  })
} 