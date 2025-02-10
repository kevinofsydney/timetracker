import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

export default async () => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL,
      },
    },
  })

  try {
    // Drop test schema
    await prisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS test CASCADE;')
  } catch (error) {
    console.error('Error cleaning up test database:', error)
  } finally {
    await prisma.$disconnect()
  }
} 