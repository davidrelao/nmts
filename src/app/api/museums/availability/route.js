import { NextResponse } from 'next/server'
import { getReservationsCollection } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const museumId = searchParams.get('museumId')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0] // Default to today

    if (!museumId) {
      return NextResponse.json(
        { error: 'Missing required parameter: museumId' },
        { status: 400 }
      )
    }

    const reservationsCollection = await getReservationsCollection()

    // Create date objects for comparison (normalize to start of day)
    const requestedDate = new Date(date)
    const startOfDay = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate())
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    // Get all reservations for this museum on this date
    const reservations = await reservationsCollection
      .find({
        museumId: museumId,
        visitDate: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      })
      .toArray()

    // Define sections and time slots (30-minute intervals)
    const sections = ['fine-arts', 'anthropology', 'natural-history']
    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00']
    const maxCapacityPerSlot = 1 // 1 booking per time slot

    // Calculate availability for each section
    const sectionAvailability = {}
    
    sections.forEach(section => {
      sectionAvailability[section] = {
        totalBooked: 0,
        totalAvailable: timeSlots.length, // Total time slots available
        timeSlots: {}
      }

      timeSlots.forEach(time => {
        const sectionTimeReservation = reservations.find(r => 
          r.museumSection === section && r.visitTime === time
        )
        
        const isBooked = !!sectionTimeReservation
        const isAvailable = !isBooked
        
        sectionAvailability[section].timeSlots[time] = {
          isBooked,
          isAvailable,
          reservation: sectionTimeReservation ? {
            reservationCode: sectionTimeReservation.reservationCode,
            visitorName: sectionTimeReservation.visitorName,
            numberOfVisitors: sectionTimeReservation.numberOfVisitors
          } : null
        }
        
        if (isBooked) {
          sectionAvailability[section].totalBooked += 1
        }
      })
      
      sectionAvailability[section].totalAvailable = timeSlots.length - sectionAvailability[section].totalBooked
    })

    return NextResponse.json({
      date,
      museumId,
      sectionAvailability,
      timeSlots,
      maxCapacityPerSlot
    })
  } catch (error) {
    console.error('Error fetching museum availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability', details: error.message },
      { status: 500 }
    )
  }
}
