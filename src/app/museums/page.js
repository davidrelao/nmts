import { prisma } from '@/lib/db'
import MuseumsClient from './MuseumsClient'

export default async function MuseumsPage() {
  // Fetch museum data from MySQL database
  const museum = await prisma.museum.findFirst()

  return <MuseumsClient museum={museum} />
}
