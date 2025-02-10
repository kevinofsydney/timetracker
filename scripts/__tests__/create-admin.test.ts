import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { PrismaClient, UserRole } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { main } from '../create-admin'

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

describe('create-admin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create a new admin user', async () => {
    const mockUser = {
      id: '1',
      email: 'kevin@courant.live',
      name: 'Kevin Gatdula',
      role: UserRole.ADMIN,
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    prismaMock.user.create.mockResolvedValue(mockUser)

    await expect(main()).resolves.not.toThrow()
  })

  test('should handle existing user error', async () => {
    prismaMock.user.create.mockRejectedValue({
      code: 'P2002',
      clientVersion: '5.x',
    })

    await expect(main()).resolves.not.toThrow()
  })

  test('should handle other errors', async () => {
    const testError = new Error('Test error')
    prismaMock.user.create.mockRejectedValue(testError)

    await expect(main()).resolves.not.toThrow()
  })
}) 