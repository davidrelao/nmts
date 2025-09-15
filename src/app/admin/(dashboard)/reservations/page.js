import { getReservationsCollection, getMuseumsCollection } from '@/lib/db'
import ReservationsManagement from '../components/ReservationsManagement'

export default async function ReservationsPage({ searchParams }) {
  const { 
    date = '', // Default to no date filter to show all reservations
    section = 'all',
    status = 'all',
    search = ''
  } = searchParams

  // Build filter conditions for MongoDB
  const whereConditions = {}

  // Date filter - filter by creation date instead of visit date for admin view
  if (date) {
    const selectedDate = new Date(date)
    const nextDay = new Date(selectedDate)
    nextDay.setDate(selectedDate.getDate() + 1)
    
    whereConditions.createdAt = {
      $gte: selectedDate,
      $lt: nextDay
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

  // Search filter
  if (search) {
    whereConditions.$or = [
      { visitorName: { $regex: search, $options: 'i' } },
      { visitorEmail: { $regex: search, $options: 'i' } },
      { reservationCode: { $regex: search, $options: 'i' } }
    ]
  }

  // Initialize default values
  let reservations = []
  let sections = []

  try {
    const reservationsCollection = await getReservationsCollection()
    const museumsCollection = await getMuseumsCollection()

    // Fetch reservations with filters
    reservations = await reservationsCollection
      .find(whereConditions)
      .sort({ visitTime: 1 })
      .toArray()

    // Populate museum data
    reservations = await Promise.all(
      reservations.map(async (reservation) => {
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

    // Get unique sections for filter dropdown
    const sectionData = await reservationsCollection.distinct('museumSection')
    sections = sectionData
  } catch (error) {
    console.error('Error fetching reservations data:', error)
    // Continue with empty arrays - the page will show empty state
  }

  return (
    <ReservationsManagement 
      reservations={reservations}
      sections={sections}
      filters={{ date, section, status, search }}
    />
  )
}
