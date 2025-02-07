import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createTimeEntrySchema = z.object({
  shiftType: z.enum(['STANDARD', 'SUNDAY', 'EMERGENCY', 'OVERNIGHT']),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const body = createTimeEntrySchema.parse(json)

    const existingActiveEntry = await prisma.timeEntry.findFirst({
      where: {
        userId: session.user.id,
        clockOut: null,
      },
    })

    if (existingActiveEntry) {
      return new NextResponse('You already have an active time entry', {
        status: 400,
      })
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        userId: session.user.id,
        shiftType: body.shiftType,
        clockIn: new Date().toISOString(),
      },
    })

    return NextResponse.json(timeEntry)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        clockIn: 'desc',
      },
      take: 10,
    })

    return NextResponse.json(timeEntries)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
} 