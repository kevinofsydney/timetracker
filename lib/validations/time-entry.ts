import { z } from 'zod'

export const TimeEntrySchema = z.object({
  shiftType: z.enum(['STANDARD', 'SUNDAY', 'EMERGENCY', 'OVERNIGHT']),
  concertId: z.string(),
})

export type TimeEntryInput = z.infer<typeof TimeEntrySchema> 