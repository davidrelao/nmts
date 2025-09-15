import { NextResponse } from 'next/server'
import { getReservationsCollection } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const time = searchParams.get('time')
    const section = searchParams.get('section')
    const museumId = searchParams.get('museumId')

    if (!date || !time || !section || !museumId) {
      return NextResponse.json(
        { error: 'Missing required parameters: date, time, section, museumId' },
        { status: 400 }
      )
    }

    const reservationsCollection = await getReservationsCollection()

    // Create date objects for comparison (normalize to start of day)
    const requestedDate = new Date(date)
    const startOfDay = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate())
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    // Check for existing reservation on the same date, time, and section
    const existingReservation = await reservationsCollection
      .findOne({
        museumId: museumId,
        museumSection: section,
        visitTime: time,
        visitDate: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      })

    // Simple availability: 1 booking per date/time/exhibit
    const isAvailable = !existingReservation

    return NextResponse.json({
      available: isAvailable,
      isBooked: !!existingReservation,
      existingReservation: existingReservation ? {
        reservationCode: existingReservation.reservationCode,
        visitorName: existingReservation.visitorName,
        visitorEmail: existingReservation.visitorEmail,
        numberOfVisitors: existingReservation.numberOfVisitors
      } : null,
      requestedDate: date,
      requestedTime: time,
      requestedSection: section,
      requestedMuseumId: museumId
    })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability', details: error.message },
      { status: 500 }
    )
  }
}
