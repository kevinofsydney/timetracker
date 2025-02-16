import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TimeEntrySchema } from '@/lib/validations/time-entry'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }), 
        { status: 401 }
      )
    }

    const json = await request.json()
    
    try {
      const validatedData = TimeEntrySchema.parse(json)
      
      // Check if the concert exists and is active
      const concert = await prisma.concert.findUnique({
        where: {
          id: validatedData.concertId,
          isActive: true,
        },
      })

      if (!concert) {
        throw new Error('Selected concert not found or is inactive')
      }

      const clockIn = new Date(validatedData.clockIn)
      const clockOut = new Date(validatedData.clockOut)
      const rawHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)
      const roundedHours = Math.ceil(rawHours * 4) / 4 // Round up to nearest 0.25

      const timeEntry = await prisma.timeEntry.create({
        data: {
          userId: session.user.id,
          concertId: validatedData.concertId,
          clockIn,
          clockOut,
          shiftType: validatedData.shiftType,
          rawHours,
          roundedHours,
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
    } catch (validationError) {
      console.error('Validation error:', validationError)
      if (validationError instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({
            message: 'Validation failed',
            errors: validationError.errors,
          }),
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    console.error('Failed to create time entry:', error)
    return new NextResponse(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Failed to create time entry',
        error: String(error)
      }), 
      { status: 500 }
    )
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
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: String(error) }), 
      { status: 500 }
    )
  }
} 