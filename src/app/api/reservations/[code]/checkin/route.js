import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request, { params }) {
  try {
    const { code } = params

    if (!code) {
      return NextResponse.json(
        { error: 'Reservation code is required' },
        { status: 400 }
      )
    }

    // Find reservation by code
    const reservation = await prisma.reservation.findUnique({
      where: {
        reservationCode: code
      },
      include: {
        museum: {
          select: {
            id: true,
            name: true,
            location: true,
            openingHours: true,
            admissionPrice: true,
          }
        }
      }
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

    // Check if visit date is today
    const today = new Date()
    const visitDate = new Date(reservation.visitDate)
    const isToday = today.toDateString() === visitDate.toDateString()

    if (!isToday) {
      return NextResponse.json(
        { error: 'Cannot check in on a different date than reserved' },
        { status: 400 }
      )
    }

    // Update reservation to checked in
    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservation.id
      },
      data: {
        checkedIn: true,
        checkedInAt: new Date()
      },
      include: {
        museum: {
          select: {
            id: true,
            name: true,
            location: true,
            openingHours: true,
            admissionPrice: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Check-in successful',
      reservation: updatedReservation
    })

  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
