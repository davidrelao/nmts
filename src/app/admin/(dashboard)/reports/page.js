import { prisma } from '@/lib/db'
import ReportsPage from '../components/ReportsPage'

export default async function Reports() {
  // Get comprehensive analytics data
  const [
    totalReservations,
    totalVisitors,
    checkedInReservations,
    sectionStats,
    monthlyStats,
    recentReservations
  ] = await Promise.all([
    // Total reservations
    prisma.reservation.count(),
    
    // Total visitors
    prisma.reservation.aggregate({
      _sum: { numberOfVisitors: true }
    }),
    
    // Checked in reservations
    prisma.reservation.count({
      where: { checkedIn: true }
    }),
    
    // Section popularity
    prisma.reservation.groupBy({
      by: ['museumSection'],
      _count: { id: true },
      _sum: { numberOfVisitors: true }
    }),
    
    // Monthly stats (last 6 months)
    prisma.reservation.groupBy({
      by: ['visitDate'],
      where: {
        visitDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      _count: { id: true },
      _sum: { numberOfVisitors: true }
    }),
    
    // Recent reservations
    prisma.reservation.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        museum: {
          select: { name: true }
        }
      }
    })
  ])

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
