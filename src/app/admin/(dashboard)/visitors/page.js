import { prisma } from '@/lib/db'
import VisitorsManagement from '../components/VisitorsManagement'

export default async function VisitorsPage({ searchParams }) {
  const { 
    search = '',
    sortBy = 'name',
    sortOrder = 'asc'
  } = searchParams

  // Build search conditions
  const whereConditions = {}
  if (search) {
    whereConditions.OR = [
      { visitorName: { contains: search } },
      { visitorEmail: { contains: search } }
    ]
  }

  // Initialize default values
  let visitors = []
  let visitorData = []

  try {
    // Get unique visitors with their reservation counts
    visitors = await prisma.reservation.groupBy({
      by: ['visitorName', 'visitorEmail'],
      where: whereConditions,
      _count: {
        id: true
      },
      _max: {
        visitDate: true
      },
      _sum: {
        numberOfVisitors: true
      }
    })

    // Transform data for display
    visitorData = visitors.map(visitor => ({
    name: visitor.visitorName,
    email: visitor.visitorEmail,
    totalReservations: visitor._count.id,
    totalVisitors: visitor._sum.numberOfVisitors,
    lastVisit: visitor._max.visitDate
  }))

  // Sort the data after transformation
  if (sortBy === 'name') {
    visitorData.sort((a, b) => {
      const result = a.name.localeCompare(b.name)
      return sortOrder === 'asc' ? result : -result
    })
  } else if (sortBy === 'email') {
    visitorData.sort((a, b) => {
      const result = a.email.localeCompare(b.email)
      return sortOrder === 'asc' ? result : -result
    })
  } else if (sortBy === 'lastVisit') {
    visitorData.sort((a, b) => {
      const dateA = new Date(a.lastVisit || 0)
      const dateB = new Date(b.lastVisit || 0)
      const result = dateA - dateB
      return sortOrder === 'asc' ? result : -result
    })
  } else {
    // Default sort by total reservations
    visitorData.sort((a, b) => {
      const result = a.totalReservations - b.totalReservations
      return sortOrder === 'asc' ? result : -result
    })
  }
  } catch (error) {
    console.error('Error fetching visitors data:', error)
    // Continue with empty array - the page will show empty state
  }

  return (
    <VisitorsManagement 
      visitors={visitorData}
      filters={{ search, sortBy, sortOrder }}
    />
  )
}
