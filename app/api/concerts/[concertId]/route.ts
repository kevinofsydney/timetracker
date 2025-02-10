import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { concertId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { isActive } = await request.json()

    const concert = await prisma.concert.update({
      where: {
        id: params.concertId,
      },
      data: {
        isActive,
      },
    })

    return NextResponse.json(concert)
  } catch (error) {
    console.error('Error updating concert:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 