import { getReservationsCollection } from '@/lib/db'
import VisitorsManagement from '../components/VisitorsManagement'

export default async function VisitorsPage({ searchParams }) {
  const { 
    search = '',
    sortBy = 'name',
    sortOrder = 'asc'
  } = searchParams

  // Build search conditions for MongoDB
  const whereConditions = {}
  if (search) {
    whereConditions.$or = [
      { visitorName: { $regex: search, $options: 'i' } },
      { visitorEmail: { $regex: search, $options: 'i' } }
    ]
  }

  // Initialize default values
  let visitors = []
  let visitorData = []

  try {
    const reservationsCollection = await getReservationsCollection()

    // Get all reservations with search filter
    const allReservations = await reservationsCollection
      .find(whereConditions)
      .toArray()

    // Group by visitor name and email
    const visitorMap = new Map()
    
    allReservations.forEach(reservation => {
      const key = `${reservation.visitorName}|${reservation.visitorEmail}`
      
      if (!visitorMap.has(key)) {
        visitorMap.set(key, {
          name: reservation.visitorName,
          email: reservation.visitorEmail,
          totalReservations: 0,
          totalVisitors: 0,
          lastVisit: null
        })
      }
      
      const visitor = visitorMap.get(key)
      visitor.totalReservations += 1
      visitor.totalVisitors += reservation.numberOfVisitors
      
      if (!visitor.lastVisit || new Date(reservation.visitDate) > new Date(visitor.lastVisit)) {
        visitor.lastVisit = reservation.visitDate
      }
    })

    visitorData = Array.from(visitorMap.values())

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
