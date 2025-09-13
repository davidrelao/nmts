#!/usr/bin/env node

/**
 * Production Database Setup Script
 * This script sets up the database schema and seeds initial data for production
 */

const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function setupProduction() {
  console.log('🚀 Setting up production database...')
  
  try {
    // 1. Generate Prisma client
    console.log('📦 Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    
    // 2. Push database schema
    console.log('🗄️ Pushing database schema...')
    execSync('npx prisma db push', { stdio: 'inherit' })
    
    // 3. Check if museums exist
    const existingMuseums = await prisma.museum.count()
    
    if (existingMuseums === 0) {
      console.log('🌱 Seeding initial data...')
      
      // Create museums
      const museums = await prisma.museum.createMany({
        data: [
          {
            name: 'National Museum of the Philippines',
            description: 'The premier cultural institution showcasing Philippine art, culture, and natural history.',
            location: 'Rizal Park, Manila',
            openingHours: 'Tuesday-Sunday, 10:00 AM - 5:00 PM',
            admissionPrice: 'Free',
            imageUrl: '/assets/national-museum-ph.webp',
            capacity: 500,
            sections: ['Fine Arts', 'Anthropology', 'Natural History']
          },
          {
            name: 'Ayala Museum',
            description: 'A modern museum featuring contemporary Philippine art and cultural exhibitions.',
            location: 'Makati Avenue, Makati City',
            openingHours: 'Tuesday-Sunday, 9:00 AM - 6:00 PM',
            admissionPrice: '₱425',
            imageUrl: '/assets/national-museum-ph.webp',
            capacity: 300,
            sections: ['Contemporary Art', 'Cultural Heritage', 'Special Exhibitions']
          },
          {
            name: 'Mind Museum',
            description: 'An interactive science museum promoting scientific literacy and discovery.',
            location: 'Bonifacio Global City, Taguig',
            openingHours: 'Tuesday-Sunday, 9:00 AM - 6:00 PM',
            admissionPrice: '₱750',
            imageUrl: '/assets/national-museum-ph.webp',
            capacity: 400,
            sections: ['Science', 'Technology', 'Innovation']
          }
        ]
      })
      
      console.log(`✅ Created ${museums.count} museums`)
    } else {
      console.log(`✅ Database already has ${existingMuseums} museums`)
    }
    
    // 4. Create admin user (if needed)
    console.log('👤 Setting up admin access...')
    console.log('ℹ️ Admin login: username="admin", password="admin123"')
    console.log('⚠️ IMPORTANT: Change these credentials in production!')
    
    console.log('🎉 Production setup completed successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Test your deployment at your Vercel URL')
    console.log('2. Go to /admin/login to access admin panel')
    console.log('3. Change default admin credentials')
    console.log('4. Set up monitoring and backups')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run setup
setupProduction()
