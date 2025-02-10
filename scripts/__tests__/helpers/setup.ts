import { PrismaClient } from '@prisma/client'
import { mockDeep, MockProxy } from 'jest-mock-extended'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>()
}))

beforeEach(() => {
  jest.resetModules()
})

afterEach(async () => {
  const prismaMock = prisma as unknown as MockProxy<PrismaClient>
  prismaMock.$disconnect.mockResolvedValue()
}) 