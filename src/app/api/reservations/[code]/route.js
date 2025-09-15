import { NextResponse } from 'next/server'
import { getReservationsCollection, getMuseumsCollection } from '@/lib/db'

export async function GET(request, { params }) {
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

    const reservation = await reservationsCollection.findOne({
      reservationCode: code
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Get museum data
    const museum = await museumsCollection.findOne({ _id: reservation.museumId })
    const reservationWithMuseum = {
      ...reservation,
      museum: museum ? {
        _id: museum._id,
        name: museum.name,
        location: museum.location,
        openingHours: museum.openingHours,
        admissionPrice: museum.admissionPrice,
      } : null
    }

    return NextResponse.json(reservationWithMuseum)
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
