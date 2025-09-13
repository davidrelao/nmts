#!/usr/bin/env node

/**
 * Team Setup Script
 * This script helps new team members set up the project quickly
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🏛️ Museum Reservation System - Team Setup')
console.log('==========================================')

async function teamSetup() {
  try {
    // 1. Check if .env exists
    if (!fs.existsSync('.env')) {
      console.log('📝 Creating .env file...')
      if (fs.existsSync('env.example')) {
        fs.copyFileSync('env.example', '.env')
        console.log('✅ Created .env from env.example')
        console.log('⚠️  Please edit .env with your database settings!')
      } else {
        console.log('❌ env.example not found!')
        process.exit(1)
      }
    } else {
      console.log('✅ .env file already exists')
    }

    // 2. Install dependencies
    console.log('📦 Installing dependencies...')
    execSync('npm install', { stdio: 'inherit' })
    console.log('✅ Dependencies installed')

    // 3. Generate Prisma client
    console.log('🔧 Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    console.log('✅ Prisma client generated')

    // 4. Check database connection
    console.log('🗄️ Checking database connection...')
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'pipe' })
      console.log('✅ Database schema updated')
    } catch (error) {
      console.log('⚠️  Database connection failed. Please check your .env file!')
      console.log('   Make sure DATABASE_URL is correct and MySQL is running.')
    }

    // 5. Seed database
    console.log('🌱 Seeding database...')
    try {
      execSync('npm run db:seed', { stdio: 'inherit' })
      console.log('✅ Database seeded with sample data')
    } catch (error) {
      console.log('⚠️  Database seeding failed. You can run it manually later.')
    }

    console.log('')
    console.log('🎉 Setup completed!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Edit .env file with your database settings')
    console.log('2. Run: npm run dev')
    console.log('3. Visit: http://localhost:3000')
    console.log('4. Admin login: admin / admin123')
    console.log('')
    console.log('📖 See TEAM_SETUP_GUIDE.md for detailed instructions')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('')
    console.log('Please check:')
    console.log('1. Node.js is installed (version 18+)')
    console.log('2. MySQL is running (if using local database)')
    console.log('3. .env file has correct database URL')
    console.log('')
    console.log('📖 See TEAM_SETUP_GUIDE.md for troubleshooting')
    process.exit(1)
  }
}

// Run setup
teamSetup()
