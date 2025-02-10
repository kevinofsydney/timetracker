import { PrismaClient, UserRole } from '@prisma/client'
import { DeepMockProxy } from 'jest-mock-extended'
import { createMockContext } from './helpers/setup'

// Mock Prisma before importing modules that use it
const mockContext = createMockContext()
jest.mock('@/lib/prisma', () => ({
  prisma: mockContext.prisma,
  __esModule: true,
}))

// Import after mocking
import { createAdmin } from '../create-admin'

describe('create-admin script', () => {
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    jest.resetModules()
    prismaMock = mockContext.prisma
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new admin user', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.ADMIN,
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    prismaMock.user.findUnique.mockResolvedValueOnce(null)
    prismaMock.user.create.mockResolvedValueOnce(mockUser)

    const result = await createAdmin('test@example.com', 'Test User', 'password123')
    expect(result.success).toBe(true)
    expect(result.user).toEqual(mockUser)
  })

  it('should handle existing user', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.ADMIN,
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    prismaMock.user.findUnique.mockResolvedValueOnce(mockUser)

    const result = await createAdmin('test@example.com', 'Test User', 'password123')
    expect(result.success).toBe(false)
    expect(result.message).toBe('User already exists')
  })

  it('should handle database errors', async () => {
    prismaMock.user.findUnique.mockRejectedValueOnce(new Error('Database error'))

    const result = await createAdmin('test@example.com', 'Test User', 'password123')
    expect(result.success).toBe(false)
    expect(result.message).toBe('Failed to create user')
  })
}) 