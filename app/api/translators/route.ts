import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import * as z from 'zod'

const createTranslatorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const body = createTranslatorSchema.parse(json)

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return new NextResponse('User with this email already exists', { status: 400 })
    }

    const hashedPassword = await hash(body.password, 12)

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: 'TRANSLATOR',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse('Failed to create translator', { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const translators = await prisma.user.findMany({
      where: {
        role: 'TRANSLATOR',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(translators)
  } catch (error) {
    console.error('Failed to fetch translators:', error)
    return new NextResponse('Failed to fetch translators', { status: 500 })
  }
} 