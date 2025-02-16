import { z } from 'zod'

export const TimeEntrySchema = z.object({
  clockIn: z.string().datetime({
    message: "Please provide a valid clock-in date and time"
  }),
  clockOut: z.string().datetime({
    message: "Please provide a valid clock-out date and time"
  }),
  concertId: z.string({
    required_error: "Please select a concert"
  }),
  shiftType: z.enum(['STANDARD', 'SUNDAY', 'EMERGENCY', 'OVERNIGHT'], {
    required_error: "Please select a shift type"
  }),
}).refine(data => {
  const clockIn = new Date(data.clockIn)
  const clockOut = new Date(data.clockOut)
  return clockOut > clockIn
}, {
  message: "Clock-out time must be after clock-in time",
  path: ["clockOut"]
})

export type TimeEntryInput = z.infer<typeof TimeEntrySchema> 