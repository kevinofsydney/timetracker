import { PrismaClient } from '@prisma/client'
import { DeepMockProxy } from 'jest-mock-extended'
import { mockConcert } from './helpers/test-utils'
import { createMockContext } from './helpers/setup'

// Mock Prisma before importing modules that use it
const mockContext = createMockContext()
jest.mock('@/lib/prisma', () => ({
  prisma: mockContext.prisma,
  __esModule: true,
}))

// Import after mocking
import { createConcert, updateConcert } from '../../lib/concerts'

describe('Concert Management', () => {
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    jest.resetModules()
    prismaMock = mockContext.prisma
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createConcert', () => {
    it('should create a new concert', async () => {
      prismaMock.concert.create.mockResolvedValue(mockConcert)

      const result = await createConcert({
        name: 'Test Concert',
        isActive: true,
      })

      expect(result).toEqual(mockConcert)
      expect(prismaMock.concert.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Concert',
          isActive: true,
        },
      })
    })
  })

  describe('updateConcert', () => {
    it('should update concert status', async () => {
      const updatedConcert = { ...mockConcert, isActive: false }
      prismaMock.concert.update.mockResolvedValue(updatedConcert)

      const result = await updateConcert(mockConcert.id, { isActive: false })

      expect(result).toEqual(updatedConcert)
      expect(prismaMock.concert.update).toHaveBeenCalledWith({
        where: { id: mockConcert.id },
        data: { isActive: false },
      })
    })
  })
}) 