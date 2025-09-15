import clientPromise from './mongodb';

// Database collections
const DB_NAME = 'museum_reservation';

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export async function getMuseumsCollection() {
  const db = await getDatabase();
  return db.collection('museums');
}

export async function getReservationsCollection() {
  const db = await getDatabase();
  return db.collection('reservations');
}

// Helper function to generate unique IDs
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}