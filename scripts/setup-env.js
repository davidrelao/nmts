const fs = require('fs')
const path = require('path')

const envContent = `# Database
DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# JWT
JWT_SECRET="your-jwt-secret-here"
`

const envPath = path.join(process.cwd(), '.env')

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env file with default values')
  console.log('📝 Please update the DATABASE_URL with your MySQL credentials')
} else {
  console.log('⚠️  .env file already exists')
}

console.log('\n📋 Next steps:')
console.log('1. Update .env file with your MySQL database credentials')
console.log('2. Make sure MySQL is running')
console.log('3. Create the database: mysql -u root -p -e "CREATE DATABASE museum_reservation;"')
console.log('4. Run: npm run db:push')
console.log('5. Run: npm run db:seed')
