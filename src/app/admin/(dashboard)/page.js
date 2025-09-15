import { getReservationsCollection, getMuseumsCollection } from '@/lib/db'
import DashboardOverview from './components/DashboardOverview'

export default async function AdminPage() {
  // Fetch today's reservations
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Fetch this week's reservations
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  // Fetch this month's reservations
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1)

  let todaysReservations = []
  let weeklyReservations = []
  let monthlyReservations = []
  let allReservations = []

  try {
    const reservationsCollection = await getReservationsCollection()
    const museumsCollection = await getMuseumsCollection()

    // Get all reservations first to debug
    allReservations = await reservationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // console.log('All reservations found:', allReservations.length)
    // console.log('Sample reservation:', allReservations[0])

    // Today's reservations - filter by creation date for admin view
    todaysReservations = allReservations.filter(r => {
      const createdDate = new Date(r.createdAt)
      return createdDate.toDateString() === today.toDateString()
    })

    // This week's reservations - filter by creation date
    weeklyReservations = allReservations.filter(r => {
      const createdDate = new Date(r.createdAt)
      return createdDate >= weekStart && createdDate < weekEnd
    })

    // This month's reservations - filter by creation date
    monthlyReservations = allReservations.filter(r => {
      const createdDate = new Date(r.createdAt)
      return createdDate >= monthStart && createdDate < monthEnd
    })

    // allReservations already fetched above

    // Populate museum data for today's reservations
    todaysReservations = await Promise.all(
      todaysReservations.map(async (reservation) => {
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
  } catch (error) {
    console.error('Error fetching reservation data:', error)
    // Continue with empty arrays - the dashboard will show empty state
  }

  // Calculate comprehensive stats
  const stats = {
    today: {
      reservations: todaysReservations.length,
      visitors: todaysReservations.reduce((sum, res) => sum + res.numberOfVisitors, 0),
      checkedIn: todaysReservations.filter(res => res.checkedIn).length
    },
    week: {
      reservations: weeklyReservations.length,
      visitors: weeklyReservations.reduce((sum, res) => sum + res.numberOfVisitors, 0),
      checkedIn: weeklyReservations.filter(res => res.checkedIn).length
    },
    month: {
      reservations: monthlyReservations.length,
      visitors: monthlyReservations.reduce((sum, res) => sum + res.numberOfVisitors, 0),
      checkedIn: monthlyReservations.filter(res => res.checkedIn).length
    },
    total: {
      reservations: allReservations.length,
      visitors: allReservations.reduce((sum, res) => sum + res.numberOfVisitors, 0),
      checkedIn: allReservations.filter(res => res.checkedIn).length
    }
  }

  // Calculate section popularity
  const sectionStats = todaysReservations.reduce((acc, res) => {
    acc[res.museumSection] = (acc[res.museumSection] || 0) + res.numberOfVisitors
    return acc
  }, {})

  // Calculate hourly distribution
  const hourlyStats = todaysReservations.reduce((acc, res) => {
    const hour = parseInt(res.visitTime.split(':')[0])
    acc[hour] = (acc[hour] || 0) + res.numberOfVisitors
    return acc
  }, {})

  return (
    <DashboardOverview 
      todaysReservations={todaysReservations}
      stats={stats}
      sectionStats={sectionStats}
      hourlyStats={hourlyStats}
    />
  )
}
