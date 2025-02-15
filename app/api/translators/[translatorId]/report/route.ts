import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { translatorId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    if (!start || !end) {
      return new NextResponse('Missing date range', { status: 400 })
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId: params.translatorId,
        clockIn: {
          gte: new Date(start),
          lte: new Date(end),
        },
        clockOut: { not: null },
      },
      include: {
        concert: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        clockIn: 'asc',
      },
    })

    // Generate CSV content
    const csvRows = [
      ['Concert', 'Clock In', 'Clock Out', 'Hours', 'Shift Type'],
      ...timeEntries.map(entry => [
        entry.concert.name,
        new Date(entry.clockIn).toLocaleString(),
        entry.clockOut ? new Date(entry.clockOut).toLocaleString() : '',
        entry.roundedHours?.toString() || '',
        entry.shiftType,
      ]),
    ]

    const csvContent = csvRows
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    // Set headers for CSV download
    const headers = new Headers()
    headers.set('Content-Type', 'text/csv')
    headers.set('Content-Disposition', 'attachment; filename=report.csv')

    return new NextResponse(csvContent, {
      headers,
    })
  } catch (error) {
    console.error('Failed to generate report:', error)
    return new NextResponse('Failed to generate report', { status: 500 })
  }
} 