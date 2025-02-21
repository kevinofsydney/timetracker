import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Mark the route as dynamic
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const activeEntry = await prisma.timeEntry.findFirst({
      where: {
        userId: session.user.id,
        clockOut: null,
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

    return NextResponse.json(activeEntry)
  } catch (error) {
    console.error('Error fetching active time entry:', error)
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: String(error) }), 
      { status: 500 }
    )
  }
} 