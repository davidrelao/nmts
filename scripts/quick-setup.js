const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🏛️ Museum Reservation System - Quick Setup')
console.log('==========================================')

// Check if .env exists
const envPath = path.join(process.cwd(), '.env')
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found. Please run: npm run setup:env')
  process.exit(1)
}

// Check if MySQL is available
try {
  execSync('mysql --version', { stdio: 'pipe' })
  console.log('✅ MySQL is available')
} catch (error) {
  console.log('❌ MySQL is not installed or not in PATH')
  console.log('📋 Please install MySQL first:')
  console.log('   Option 1: brew install mysql')
  console.log('   Option 2: Use Docker: docker run --name mysql-museum -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=museum_reservation -p 3306:3306 -d mysql:8.0')
  console.log('   See MYSQL_SETUP.md for detailed instructions')
  process.exit(1)
}

// Try to create database
try {
  console.log('🗄️  Creating database...')
  execSync('mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS museum_reservation;"', { stdio: 'inherit' })
  console.log('✅ Database created successfully')
} catch (error) {
  console.log('⚠️  Could not create database automatically')
  console.log('📋 Please create the database manually:')
  console.log('   mysql -u root -p')
  console.log('   CREATE DATABASE museum_reservation;')
  console.log('   exit;')
}

// Generate Prisma client
try {
  console.log('🔧 Generating Prisma client...')
  execSync('npm run db:generate', { stdio: 'inherit' })
  console.log('✅ Prisma client generated')
} catch (error) {
  console.log('❌ Failed to generate Prisma client')
  process.exit(1)
}

// Push schema
try {
  console.log('📊 Pushing database schema...')
  execSync('npm run db:push', { stdio: 'inherit' })
  console.log('✅ Database schema pushed')
} catch (error) {
  console.log('❌ Failed to push schema')
  process.exit(1)
}

// Seed database
try {
  console.log('🌱 Seeding database...')
  execSync('npm run db:seed', { stdio: 'inherit' })
  console.log('✅ Database seeded')
} catch (error) {
  console.log('❌ Failed to seed database')
  process.exit(1)
}

console.log('')
console.log('🎉 Setup completed successfully!')
console.log('')
console.log('🚀 Next steps:')
console.log('1. Run: npm run dev')
console.log('2. Open: http://localhost:3000 (Public reservation system)')
console.log('3. Open: http://localhost:3000/admin (Admin panel)')
console.log('')
console.log('Happy coding! 🏛️')
