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
    
    // The QR code data URL contains the base64 encoded image
    // We need to decode it to see what's actually in the QR code
    const qrCodeDataUrl = reservation.qrCodeData
    
    // For now, let's just return the reservation details and QR code info
    return NextResponse.json({
      reservation: {
        reservationCode: reservation.reservationCode,
        visitorEmail: reservation.visitorEmail,
        visitorName: reservation.visitorName,
        visitDate: reservation.visitDate,
        visitTime: reservation.visitTime,
        museumSection: reservation.museumSection,
        museumId: reservation.museumId,
        numberOfVisitors: reservation.numberOfVisitors
      },
      qrCodeInfo: {
        hasQRCode: !!qrCodeDataUrl,
        qrCodeLength: qrCodeDataUrl ? qrCodeDataUrl.length : 0,
        qrCodePreview: qrCodeDataUrl ? qrCodeDataUrl.substring(0, 100) + '...' : null
      },
      message: 'This shows what should be encoded in the QR code. The QR code should contain a JSON object with the reservation details.'
    })
  } catch (error) {
    console.error('Error decoding QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
