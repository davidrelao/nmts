const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function cleanDatabase() {
  console.log('🧹 Starting database cleanup...')

  try {
    // Delete all reservations first (due to foreign key constraint)
    const deletedReservations = await prisma.reservation.deleteMany({})
    console.log(`✅ Deleted ${deletedReservations.count} reservations`)

    // Delete all museums
    const deletedMuseums = await prisma.museum.deleteMany({})
    console.log(`✅ Deleted ${deletedMuseums.count} museums`)

    console.log('🎉 Database cleaned successfully!')
  } catch (error) {
    console.error('❌ Error cleaning database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase()
