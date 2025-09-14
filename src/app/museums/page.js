import { prisma } from '@/lib/db'
import MuseumsClient from './MuseumsClient'

export default async function MuseumsPage() {
  let museum = null
  
  try {
    // Fetch museum data from MySQL database
    museum = await prisma.museum.findFirst()
  } catch (error) {
    console.error('Error fetching museum data:', error)
    // Continue with null museum - the client will handle this gracefully
  }

  return <MuseumsClient museum={museum} />
}
