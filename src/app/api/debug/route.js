import { NextResponse } from 'next/server'
import { getMuseumsCollection, getReservationsCollection } from '@/lib/db'

export async function GET(request) {
  try {
    console.log('🔍 Starting database debug...')
    
    // Test museums collection
    const museumsCollection = await getMuseumsCollection()
    const museumsCount = await museumsCollection.countDocuments()
    const museums = await museumsCollection.find({}).toArray()
    
    // Test reservations collection
    const reservationsCollection = await getReservationsCollection()
    const reservationsCount = await reservationsCollection.countDocuments()
    const reservations = await reservationsCollection.find({}).toArray()
    
    console.log('✅ Database debug completed')
    
    return NextResponse.json({
      success: true,
      database: 'museum_reservation',
      collections: {
        museums: {
          count: museumsCount,
          documents: museums
        },
        reservations: {
          count: reservationsCount,
          documents: reservations
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database debug error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
