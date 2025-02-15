import { z } from 'zod'

export const TimeEntrySchema = z.object({
  clockIn: z.string(),
  concertId: z.string(),
  shiftType: z.enum(['STANDARD', 'SUNDAY', 'EMERGENCY', 'OVERNIGHT']),
})

export type TimeEntryInput = z.infer<typeof TimeEntrySchema> 