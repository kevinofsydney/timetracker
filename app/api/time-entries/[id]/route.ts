import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const updateTimeEntrySchema = z.object({
  clockOut: z.string().datetime(),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const body = updateTimeEntrySchema.parse(json)

    const timeEntry = await prisma.timeEntry.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!timeEntry) {
      return new NextResponse('Not found', { status: 404 })
    }

    if (timeEntry.clockOut) {
      return new NextResponse('Time entry already closed', { status: 400 })
    }

    const clockOut = new Date(body.clockOut)
    const clockIn = new Date(timeEntry.clockIn)
    const rawHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)
    const roundedHours = Math.ceil(rawHours * 4) / 4 // Round up to nearest 0.25

    const updatedTimeEntry = await prisma.timeEntry.update({
      where: {
        id: params.id,
      },
      data: {
        clockOut: body.clockOut,
        rawHours,
        roundedHours,
      },
    })

    return NextResponse.json(updatedTimeEntry)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse('Internal Error', { status: 500 })
  }
} 