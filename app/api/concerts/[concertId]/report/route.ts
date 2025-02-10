import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { concertId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const concertId = params.concertId

    // Get all time entries for this concert
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        concertId,
        clockOut: { not: null }, // Only include completed entries
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

    // Generate CSV content
    const csvRows = [
      ['Translator', 'Email', 'Clock In', 'Clock Out', 'Hours', 'Shift Type'],
      ...timeEntries.map(entry => [
        entry.user.name || 'Unknown',
        entry.user.email,
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