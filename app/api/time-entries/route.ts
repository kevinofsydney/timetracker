import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TimeEntrySchema } from '@/lib/validations/time-entry'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const validatedData = TimeEntrySchema.parse(json)

    const timeEntry = await prisma.timeEntry.create({
      data: {
        userId: session.user.id,
        concertId: validatedData.concertId,
        clockIn: new Date(validatedData.clockIn),
        shiftType: validatedData.shiftType,
      },
      include: {
        concert: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(timeEntry)
  } catch (error) {
    console.error('Failed to create time entry:', error)
    return new NextResponse('Failed to create time entry', { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId: session.user.id,
        clockIn: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined,
        },
      },
      include: {
        concert: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        clockIn: 'desc',
      },
    })

    return NextResponse.json(timeEntries)
  } catch (error) {
    console.error('Error fetching time entries:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 