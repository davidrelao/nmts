import { prisma } from '@/lib/db'
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
    [todaysReservations, weeklyReservations, monthlyReservations, allReservations] = await Promise.all([
    // Today's reservations
    prisma.reservation.findMany({
      where: {
        visitDate: {
          gte: today,
          lt: tomorrow
        }
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
      },
      orderBy: { visitTime: 'asc' }
    }),

    // This week's reservations
    prisma.reservation.findMany({
      where: {
        visitDate: {
          gte: weekStart,
          lt: weekEnd
        }
      }
    }),

    // This month's reservations
    prisma.reservation.findMany({
      where: {
        visitDate: {
          gte: monthStart,
          lt: monthEnd
        }
      }
    }),

    // All reservations for analytics
    prisma.reservation.findMany({
      include: {
        museum: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  ])
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
