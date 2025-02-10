import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { UserRole } from '@prisma/client'

describe('Authentication E2E', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await prisma.user.deleteMany()
  })

  it('should create and authenticate a user', async () => {
    // Create a test user
    const hashedPassword = await hash('testpass123', 10)
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.TRANSLATOR,
        password: hashedPassword,
      },
    })

    expect(user).toBeDefined()
    expect(user.email).toBe('test@example.com')
    expect(user.role).toBe(UserRole.TRANSLATOR)
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })
}) 