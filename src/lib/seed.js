const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample museum
  const museum = await prisma.museum.upsert({
    where: { id: 'museum-1' },
    update: {},
    create: {
      id: 'museum-1',
      name: 'National Museum of the Philippines',
      description: 'The premier museum showcasing Filipino art, culture, and history',
      location: 'Manila, Philippines',
      openingHours: '9:00 AM - 6:00 PM',
      admissionPrice: 'Free Admission',
      imageUrl: 'https://www.goodnewspilipinas.com/wp-content/uploads/2025/01/NMP-Manila.webp',
    },
  })

  console.log('✅ Created museum:', museum.name)

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
