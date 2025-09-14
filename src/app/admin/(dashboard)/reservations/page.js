import { prisma } from '@/lib/db'
import ReservationsManagement from '../components/ReservationsManagement'

export default async function ReservationsPage({ searchParams }) {
  const { 
    date = new Date().toISOString().split('T')[0],
    section = 'all',
    status = 'all',
    search = ''
  } = searchParams

  // Build filter conditions
  const whereConditions = {}

  // Date filter
  if (date) {
    const selectedDate = new Date(date)
    const nextDay = new Date(selectedDate)
    nextDay.setDate(selectedDate.getDate() + 1)
    
    whereConditions.visitDate = {
      gte: selectedDate,
      lt: nextDay
    }
  }

  // Section filter
  if (section !== 'all') {
    whereConditions.museumSection = section
  }

  // Status filter
  if (status === 'checked-in') {
    whereConditions.checkedIn = true
  } else if (status === 'pending') {
    whereConditions.checkedIn = false
  }

  // Search filter - combine with other conditions using AND
  if (search) {
    const searchConditions = [
      { visitorName: { contains: search } },
      { visitorEmail: { contains: search } },
      { reservationCode: { contains: search } }
    ]
    
    // If we have other conditions, use AND to combine them
    if (Object.keys(whereConditions).length > 0) {
      whereConditions.AND = [
        { ...whereConditions },
        { OR: searchConditions }
      ]
      // Clear the original conditions since they're now in AND
      Object.keys(whereConditions).forEach(key => {
        if (key !== 'AND') delete whereConditions[key]
      })
    } else {
      whereConditions.OR = searchConditions
    }
  }

  // Initialize default values
  let reservations = []
  let sections = []

  try {
    // Fetch reservations with filters
    reservations = await prisma.reservation.findMany({
      where: whereConditions,
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
    })

    // Get unique sections for filter dropdown
    sections = await prisma.reservation.findMany({
      select: { museumSection: true },
      distinct: ['museumSection']
    })
  } catch (error) {
    console.error('Error fetching reservations data:', error)
    // Continue with empty arrays - the page will show empty state
  }

  return (
    <ReservationsManagement 
      reservations={reservations}
      sections={sections.map(s => s.museumSection)}
      filters={{ date, section, status, search }}
    />
  )
}
