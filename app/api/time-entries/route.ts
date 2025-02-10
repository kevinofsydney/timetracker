import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TimeEntrySchema } from '@/lib/validations/time-entry'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const validatedData = TimeEntrySchema.parse(body)

    const timeEntry = await prisma.timeEntry.create({
      data: {
        userId: session.user.id,
        shiftType: validatedData.shiftType,
        concertId: validatedData.concertId,
        clockIn: new Date().toISOString(),
      },
      include: {
        concert: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(timeEntry)
  } catch (error) {
    console.error('Error creating time entry:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
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
        concert: true,
        user: {
          select: {
            name: true,
            email: true,
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