import { NextResponse } from 'next/server'
import { getReservationsCollection } from '@/lib/db'

export async function GET(request) {
  try {
    const reservationsCollection = await getReservationsCollection()
    
    // Get the most recent reservation
    const reservation = await reservationsCollection
      .findOne({}, { sort: { createdAt: -1 } })
    
    if (!reservation) {
      return NextResponse.json({ error: 'No reservations found' }, { status: 404 })
    }
    
    // Decode the QR code data to see what's actually in it
    const qrCodeDataUrl = reservation.qrCodeData
    
    // Extract the base64 data
    const base64Data = qrCodeDataUrl.split(',')[1]
    
    return NextResponse.json({
      reservationCode: reservation.reservationCode,
      visitorEmail: reservation.visitorEmail,
      qrCodeDataUrl: qrCodeDataUrl.substring(0, 100) + '...', // Truncate for display
      base64Length: base64Data ? base64Data.length : 0,
      message: 'QR code data extracted successfully'
    })
  } catch (error) {
    console.error('Error testing QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
