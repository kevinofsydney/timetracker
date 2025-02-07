import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

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
        clockIn: 'desc',
      },
    })

    return NextResponse.json(timeEntries)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse('Internal Error', { status: 500 })
  }
} 