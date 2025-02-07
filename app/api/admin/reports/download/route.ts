import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { format } from 'date-fns'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const querySchema = z.object({
  start: z.string(),
  end: z.string(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = querySchema.parse({
      start: searchParams.get('start'),
      end: searchParams.get('end'),
    })

    const startDate = new Date(query.start)
    const endDate = new Date(query.end)
    endDate.setHours(23, 59, 59, 999)

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        clockIn: {
          gte: startDate,
          lte: endDate,
        },
        clockOut: {
          not: null,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        clockIn: 'asc',
      },
    })

    const csvRows = [
      [
        'Translator',
        'Email',
        'Date',
        'Shift Type',
        'Clock In',
        'Clock Out',
        'Raw Hours',
        'Rounded Hours',
        'Status',
      ],
      ...timeEntries.map((entry) => [
        entry.user.name,
        entry.user.email,
        format(new Date(entry.clockIn), 'MM/dd/yyyy'),
        entry.shiftType,
        format(new Date(entry.clockIn), 'h:mm a'),
        entry.clockOut ? format(new Date(entry.clockOut), 'h:mm a') : '',
        entry.rawHours?.toFixed(2) ?? '',
        entry.roundedHours?.toFixed(2) ?? '',
        entry.edited ? 'Edited' : 'Original',
      ]),
    ]

    const csv = csvRows.map((row) => row.join(',')).join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="timesheet-report-${query.start}-to-${query.end}.csv"`,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse('Internal Error', { status: 500 })
  }
} 