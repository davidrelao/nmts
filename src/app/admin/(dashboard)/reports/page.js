import { getReservationsCollection, getMuseumsCollection } from '@/lib/db'
import ReportsPage from '../components/ReportsPage'

export default async function Reports() {
  // Initialize default values
  let totalReservations = 0
  let totalVisitors = { _sum: { numberOfVisitors: 0 } }
  let checkedInReservations = 0
  let sectionStats = []
  let monthlyStats = []
  let recentReservations = []

  try {
    const reservationsCollection = await getReservationsCollection()
    const museumsCollection = await getMuseumsCollection()

    // Get all reservations for analytics
    const allReservations = await reservationsCollection.find({}).toArray()
    
    // Total reservations
    totalReservations = allReservations.length
    
    // Total visitors
    totalVisitors = { _sum: { numberOfVisitors: allReservations.reduce((sum, r) => sum + r.numberOfVisitors, 0) } }
    
    // Checked in reservations
    checkedInReservations = allReservations.filter(r => r.checkedIn).length
    
    // Section popularity
    const sectionMap = new Map()
    allReservations.forEach(reservation => {
      const section = reservation.museumSection
      if (!sectionMap.has(section)) {
        sectionMap.set(section, { _count: { id: 0 }, _sum: { numberOfVisitors: 0 } })
      }
      const stats = sectionMap.get(section)
      stats._count.id += 1
      stats._sum.numberOfVisitors += reservation.numberOfVisitors
    })
    sectionStats = Array.from(sectionMap.entries()).map(([section, stats]) => ({
      museumSection: section,
      ...stats
    }))
    
    // Monthly stats (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const monthlyMap = new Map()
    allReservations
      .filter(r => new Date(r.visitDate) >= sixMonthsAgo)
      .forEach(reservation => {
        const date = new Date(reservation.visitDate).toISOString().split('T')[0]
        if (!monthlyMap.has(date)) {
          monthlyMap.set(date, { _count: { id: 0 }, _sum: { numberOfVisitors: 0 } })
        }
        const stats = monthlyMap.get(date)
        stats._count.id += 1
        stats._sum.numberOfVisitors += reservation.numberOfVisitors
      })
    monthlyStats = Array.from(monthlyMap.entries()).map(([date, stats]) => ({
      visitDate: new Date(date),
      ...stats
    }))
    
    // Recent reservations
    recentReservations = allReservations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(reservation => ({
        ...reservation,
        museum: { name: 'Museum' } // We'll populate this if needed
      }))
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    // Continue with default values - the reports will show empty state
  }

  const analytics = {
    totalReservations,
    totalVisitors: totalVisitors._sum.numberOfVisitors || 0,
    checkedInReservations,
    checkInRate: totalReservations > 0 ? (checkedInReservations / totalReservations) * 100 : 0,
    sectionStats: sectionStats.map(s => ({
      section: s.museumSection,
      reservations: s._count.id,
      visitors: s._sum.numberOfVisitors
    })),
    monthlyStats: monthlyStats.map(m => ({
      date: m.visitDate,
      reservations: m._count.id,
      visitors: m._sum.numberOfVisitors
    })),
    recentReservations
  }

  return <ReportsPage analytics={analytics} />
}
