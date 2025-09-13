import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { code } = params

    if (!code) {
      return NextResponse.json(
        { error: 'Reservation code is required' },
        { status: 400 }
      )
    }

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

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
