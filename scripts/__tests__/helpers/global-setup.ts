import { execSync } from 'child_process'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Load environment variables from .env
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
    // Create test schema if it doesn't exist
    await prisma.$executeRawUnsafe('CREATE SCHEMA IF NOT EXISTS test;')

    // Run migrations on test database
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.TEST_DATABASE_URL,
        NODE_ENV: 'test',
      },
    })
  } catch (error) {
    console.error('Error setting up test database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
} 