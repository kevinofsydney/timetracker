import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting seed...')

    // Create admin user
    console.log('Creating admin user...')
    const adminPassword = await hash('admin123', 12)
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
    console.log('Admin user created:', admin.email)

    // Create translator user
    console.log('Creating translator user...')
    const translatorPassword = await hash('translator123', 12)
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
    console.log('Translator user created:', translator.email)

    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Error during seed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('Unhandled error during seed:', e)
    process.exit(1)
  }) 