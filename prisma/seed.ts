import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await hash('admin123', 12)
  const translatorPassword = await hash('translator123', 12)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create translator user
  const translator = await prisma.user.upsert({
    where: { email: 'translator@example.com' },
    update: {},
    create: {
      email: 'translator@example.com',
      name: 'Translator User',
      password: translatorPassword,
      role: 'TRANSLATOR',
    },
  })

  console.log({ admin, translator })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 