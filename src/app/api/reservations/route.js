import { NextRequest, NextResponse } from 'next/server'
import { getReservationsCollection, getMuseumsCollection, generateId } from '@/lib/db'
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
    
    // Generate QR code with just the reservation code
    const qrData = reservationCode
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrData)
    
    const reservationsCollection = await getReservationsCollection()
    const museumsCollection = await getMuseumsCollection()
    
    // Check if time slot is already booked by anyone (1 booking per date/time/exhibit)
    const visitDate = new Date(visit_date)
    const startOfDay = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate())
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)
    
    const existingBooking = await reservationsCollection.findOne({
      museumId: museum_id,
      museumSection: museum_section,
      visitTime: visit_time,
      visitDate: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })
    
    if (existingBooking) {
      return NextResponse.json(
        { 
          error: 'Time slot already booked',
          details: `This time slot for ${museum_section} on ${visit_date} at ${visit_time} is already booked by someone else. Please choose a different time.`,
          existingReservation: {
            code: existingBooking.reservationCode,
            visitorName: existingBooking.visitorName,
            date: existingBooking.visitDate,
            time: existingBooking.visitTime,
            section: existingBooking.museumSection
          }
        },
        { status: 409 }
      )
    }
    
    // Get museum details
    const museum = await museumsCollection.findOne({ _id: museum_id })
    
    // Create reservation in database
    const reservation = {
      _id: generateId(),
      visitorName: visitor_name,
      visitorEmail: visitor_email,
      reservationCode: reservationCode,
      qrCodeData: qrCodeDataUrl,
      visitDate: new Date(visit_date),
      visitTime: visit_time,
      museumSection: museum_section,
      museumId: museum_id,
      numberOfVisitors: parseInt(number_of_visitors),
      checkedIn: false,
      checkedInAt: null,
      createdAt: new Date(),
      museum: museum ? {
        _id: museum._id,
        name: museum.name,
        location: museum.location,
        openingHours: museum.openingHours,
        admissionPrice: museum.admissionPrice,
      } : null
    }
    
    await reservationsCollection.insertOne(reservation)

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
    const email = searchParams.get('email')
    
    const reservationsCollection = await getReservationsCollection()
    const museumsCollection = await getMuseumsCollection()
    
    if (email) {
      // Get reservations by email
      const reservations = await reservationsCollection
        .find({ visitorEmail: email })
        .sort({ createdAt: -1 })
        .toArray()
      
      if (reservations.length === 0) {
        return NextResponse.json(
          { error: 'No reservations found for this email' },
          { status: 404 }
        )
      }
      
      // Populate museum data for each reservation
      const reservationsWithMuseums = await Promise.all(
        reservations.map(async (reservation) => {
          const museum = await museumsCollection.findOne({ _id: reservation.museumId })
          return {
            ...reservation,
            museum: museum ? {
              _id: museum._id,
              name: museum.name,
              location: museum.location,
              openingHours: museum.openingHours,
              admissionPrice: museum.admissionPrice,
            } : null
          }
        })
      )
      
      return NextResponse.json(reservationsWithMuseums)
    }
    
    if (reservationCode) {
      // Get specific reservation by code
      const reservation = await reservationsCollection.findOne({ 
        reservationCode: reservationCode 
      })
      
      if (!reservation) {
        return NextResponse.json(
          { error: 'Reservation not found' },
          { status: 404 }
        )
      }
      
      // Get museum details
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
    }
    
    // Get all reservations (for admin purposes)
    const reservations = await reservationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    // Populate museum data for each reservation
    const reservationsWithMuseums = await Promise.all(
      reservations.map(async (reservation) => {
        const museum = await museumsCollection.findOne({ _id: reservation.museumId })
        return {
          ...reservation,
          museum: museum ? {
            _id: museum._id,
            name: museum.name,
            location: museum.location,
            openingHours: museum.openingHours,
            admissionPrice: museum.admissionPrice,
          } : null
        }
      })
    )
    
    return NextResponse.json(reservationsWithMuseums)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
