import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { translatorId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await prisma.user.delete({
      where: { id: params.translatorId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete translator:', error)
    return new NextResponse('Failed to delete translator', { status: 500 })
  }
} 