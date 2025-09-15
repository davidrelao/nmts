import { NextResponse } from 'next/server'
import { getReservationsCollection, getMuseumsCollection } from '@/lib/db'

export async function POST(request, { params }) {
  try {
    const { code } = params

    if (!code) {
      return NextResponse.json(
        { error: 'Reservation code is required' },
        { status: 400 }
      )
    }

    const reservationsCollection = await getReservationsCollection()
    const museumsCollection = await getMuseumsCollection()

    // Find reservation by code
    const reservation = await reservationsCollection.findOne({
      reservationCode: code
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Check if already checked in
    if (reservation.checkedIn) {
      return NextResponse.json(
        { error: 'Visitor has already been checked in' },
        { status: 400 }
      )
    }

    // Check if visit date matches today (same date, regardless of time)
    const today = new Date()
    const visitDate = new Date(reservation.visitDate)
    
    // Compare just the date part (year, month, day) - ignore time
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const visitDateOnly = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate())
    
    const isSameDate = todayDateOnly.getTime() === visitDateOnly.getTime()
    
    // console.log('Check-in attempt:', {
    //   reservationCode: code,
    //   today: todayDateOnly.toDateString(),
    //   visitDate: visitDateOnly.toDateString(),
    //   isSameDate,
    //   reservation: {
    //     visitDate: reservation.visitDate,
    //     checkedIn: reservation.checkedIn
    //   }
    // })

    // Allow check-in if it's the same date OR if it's within 1 day (for flexibility)
    const oneDayInMs = 24 * 60 * 60 * 1000
    const timeDifference = Math.abs(todayDateOnly.getTime() - visitDateOnly.getTime())
    const isWithinOneDay = timeDifference <= oneDayInMs
    
    if (!isSameDate && !isWithinOneDay) {
      return NextResponse.json(
        { error: 'Cannot check in on a different date than reserved' },
        { status: 400 }
      )
    }

    // Update reservation to checked in
    const updatedReservation = await reservationsCollection.findOneAndUpdate(
      { _id: reservation._id },
      {
        $set: {
          checkedIn: true,
          checkedInAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    // Get museum details
    const museum = await museumsCollection.findOne({ _id: reservation.museumId })

    const reservationWithMuseum = {
      ...updatedReservation,
      museum: museum ? {
        _id: museum._id,
        name: museum.name,
        location: museum.location,
        openingHours: museum.openingHours,
        admissionPrice: museum.admissionPrice,
      } : null
    }

    return NextResponse.json({
      success: true,
      message: 'Check-in successful',
      reservation: reservationWithMuseum
    })

  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
