import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Add pgbouncer=true to disable prepared statements
const getDbUrl = (url: string) => {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}pgbouncer=true`
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL ? getDbUrl(process.env.DATABASE_URL) : undefined
    },
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma