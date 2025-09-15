import { NextResponse } from 'next/server'
import { getReservationsCollection, getMuseumsCollection } from '@/lib/db'

export async function GET() {
  try {
    const reservationsCollection = await getReservationsCollection()
    const museumsCollection = await getMuseumsCollection()

    // Get all reservations
    const allReservations = await reservationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // Get all museums
    const allMuseums = await museumsCollection
      .find({})
      .toArray()

    // Calculate analytics
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)

    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - today.getDay())
    thisWeekStart.setHours(0, 0, 0, 0)

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    // Today's stats
    const todaysReservations = allReservations.filter(r => {
      const visitDate = new Date(r.visitDate)
      return visitDate >= startOfToday && visitDate < endOfToday
    })

    const todaysCheckedIn = todaysReservations.filter(r => r.checkedIn).length

    // This week's stats
    const weeklyReservations = allReservations.filter(r => {
      const visitDate = new Date(r.visitDate)
      return visitDate >= thisWeekStart
    })

    // This month's stats
    const monthlyReservations = allReservations.filter(r => {
      const visitDate = new Date(r.visitDate)
      return visitDate >= thisMonthStart
    })

    // Overall stats
    const totalReservations = allReservations.length
    const totalCheckedIn = allReservations.filter(r => r.checkedIn).length
    const checkInRate = totalReservations > 0 ? (totalCheckedIn / totalReservations * 100).toFixed(1) : 0

    // Popular time slots
    const timeSlotCounts = {}
    allReservations.forEach(r => {
      if (r.visitTime) {
        timeSlotCounts[r.visitTime] = (timeSlotCounts[r.visitTime] || 0) + 1
      }
    })

    const popularTimeSlots = Object.entries(timeSlotCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([time, count]) => ({ time, count }))

    // Museum popularity
    const museumCounts = {}
    allReservations.forEach(r => {
      if (r.museumId) {
        museumCounts[r.museumId] = (museumCounts[r.museumId] || 0) + 1
      }
    })

    const popularMuseums = Object.entries(museumCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([museumId, count]) => {
        const museum = allMuseums.find(m => m._id === museumId)
        return {
          museumId,
          museumName: museum ? museum.name : 'Unknown Museum',
          count
        }
      })

    // Recent activity (last 10 reservations)
    const recentReservations = allReservations.slice(0, 10).map(r => {
      const museum = allMuseums.find(m => m._id === r.museumId)
      return {
        ...r,
        museum: museum ? {
          _id: museum._id,
          name: museum.name,
          location: museum.location
        } : null
      }
    })

    const analytics = {
      summary: {
        totalReservations,
        totalCheckedIn,
        checkInRate: `${checkInRate}%`,
        totalMuseums: allMuseums.length
      },
      today: {
        reservations: todaysReservations.length,
        checkedIn: todaysCheckedIn,
        pending: todaysReservations.length - todaysCheckedIn
      },
      weekly: {
        reservations: weeklyReservations.length,
        checkedIn: weeklyReservations.filter(r => r.checkedIn).length
      },
      monthly: {
        reservations: monthlyReservations.length,
        checkedIn: monthlyReservations.filter(r => r.checkedIn).length
      },
      popularTimeSlots,
      popularMuseums,
      recentReservations,
      rawData: {
        allReservations: allReservations.slice(0, 20), // Limit for response size
        allMuseums
      }
    }

    return NextResponse.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error.message },
      { status: 500 }
    )
  }
}
