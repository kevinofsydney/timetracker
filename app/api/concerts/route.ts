import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createConcert, createConcertSchema } from '@/lib/concerts'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, isActive } = await request.json()

    const concert = await prisma.concert.create({
      data: {
        name,
        isActive,
      },
    })

    return NextResponse.json(concert)
  } catch (error) {
    console.error('Error creating concert:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const concerts = await prisma.concert.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(concerts)
  } catch (error) {
    console.error('Error fetching concerts:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 