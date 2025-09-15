import { NextResponse } from 'next/server'
import { getReservationsCollection, getMuseumsCollection } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const period = searchParams.get('period') || 'all'

    const reservationsCollection = await getReservationsCollection()
    const museumsCollection = await getMuseumsCollection()

    // Get all reservations
    let reservations = await reservationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // Filter by period if specified
    if (period !== 'all') {
      const now = new Date()
      let startDate

      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = null
      }

      if (startDate) {
        reservations = reservations.filter(r => new Date(r.createdAt) >= startDate)
      }
    }

    // Populate museum data
    const reservationsWithMuseums = await Promise.all(
      reservations.map(async (reservation) => {
        const museum = await museumsCollection.findOne({ _id: reservation.museumId })
        return {
          ...reservation,
          museum: museum ? {
            name: museum.name,
            location: museum.location
          } : null
        }
      })
    )

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'Reservation Code',
        'Visitor Name',
        'Visitor Email',
        'Number of Visitors',
        'Visit Date',
        'Visit Time',
        'Museum Section',
        'Museum Name',
        'Museum Location',
        'Status',
        'Checked In At',
        'Created At'
      ]

      const csvRows = [
        headers.join(','),
        ...reservationsWithMuseums.map(reservation => [
          reservation.reservationCode,
          `"${reservation.visitorName}"`,
          `"${reservation.visitorEmail}"`,
          reservation.numberOfVisitors,
          new Date(reservation.visitDate).toLocaleDateString(),
          reservation.visitTime,
          `"${reservation.museumSection}"`,
          `"${reservation.museum?.name || 'N/A'}"`,
          `"${reservation.museum?.location || 'N/A'}"`,
          reservation.checkedIn ? 'Checked In' : 'Pending',
          reservation.checkedInAt ? new Date(reservation.checkedInAt).toLocaleString() : 'N/A',
          new Date(reservation.createdAt).toLocaleString()
        ].join(','))
      ]

      const csvContent = csvRows.join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="museum-reservations-${period}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else if (format === 'json') {
      // Generate JSON
      const exportData = {
        exportDate: new Date().toISOString(),
        period: period,
        totalReservations: reservationsWithMuseums.length,
        reservations: reservationsWithMuseums.map(reservation => ({
          reservationCode: reservation.reservationCode,
          visitorName: reservation.visitorName,
          visitorEmail: reservation.visitorEmail,
          numberOfVisitors: reservation.numberOfVisitors,
          visitDate: reservation.visitDate,
          visitTime: reservation.visitTime,
          museumSection: reservation.museumSection,
          museum: reservation.museum,
          checkedIn: reservation.checkedIn,
          checkedInAt: reservation.checkedInAt,
          createdAt: reservation.createdAt
        }))
      }

      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="museum-reservations-${period}-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Unsupported format. Use csv or json.' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data', details: error.message },
      { status: 500 }
    )
  }
}
