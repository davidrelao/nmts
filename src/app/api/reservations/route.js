import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import QRCode from 'qrcode'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      visitor_name,
      visitor_email,
      visit_date,
      visit_time,
      museum_section,
      museum_id,
      number_of_visitors
    } = body

    // Validate required fields
    if (!visitor_name || !visitor_email || !visit_date || !visit_time || !museum_section || !museum_id || !number_of_visitors) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique reservation code
    const reservationCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    
    // Generate QR code data with all reservation details
    const qrData = JSON.stringify({
      type: 'RESERVATION',
      code: reservationCode,
      name: visitor_name,
      email: visitor_email,
      date: visit_date,
      time: visit_time,
      section: museum_section,
      museumId: museum_id,
      numberOfVisitors: parseInt(number_of_visitors),
    })
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrData)
    
    // Create reservation in database
    const reservation = await prisma.reservation.create({
      data: {
        visitorName: visitor_name,
        visitorEmail: visitor_email,
        reservationCode: reservationCode,
        qrCodeData: qrCodeDataUrl,
        visitDate: new Date(visit_date),
        visitTime: visit_time,
        museumSection: museum_section,
        museumId: museum_id,
        numberOfVisitors: parseInt(number_of_visitors),
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

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error creating reservation:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const reservationCode = searchParams.get('code')
    
    if (reservationCode) {
      // Get specific reservation by code
      const reservation = await prisma.reservation.findUnique({
        where: { reservationCode: reservationCode },
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
    }
    
    // Get all reservations (for admin purposes)
    const reservations = await prisma.reservation.findMany({
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
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
