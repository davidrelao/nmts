const { execSync } = require('child_process')

const runSeed = () => {
  try {
    console.log('🌱 Running database seed...')
    execSync('node src/lib/seed.js', {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
    console.log('✅ Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

runSeed()
