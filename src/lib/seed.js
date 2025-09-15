const { MongoClient } = require('mongodb');
require('dotenv').config();

async function seedDatabase() {
  let client;
  
  try {
    console.log('🌱 Starting MongoDB database seeding...');

    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('museum_reservation');
    const museumsCollection = db.collection('museums');

    // Create sample museum
    const museum = {
      _id: 'museum-1',
      name: 'National Museum of the Philippines',
      description: 'The premier museum showcasing Filipino art, culture, and history',
      location: 'Manila, Philippines',
      openingHours: '9:00 AM - 6:00 PM',
      admissionPrice: 'Free Admission',
      imageUrl: 'https://www.goodnewspilipinas.com/wp-content/uploads/2025/01/NMP-Manila.webp',
      createdAt: new Date(),
    };

    // Upsert the museum (insert if not exists, update if exists)
    await museumsCollection.replaceOne(
      { _id: 'museum-1' },
      museum,
      { upsert: true }
    );

    console.log('✅ Created museum:', museum.name);
    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

module.exports = { seedDatabase };