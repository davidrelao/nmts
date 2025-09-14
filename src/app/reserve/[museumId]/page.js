import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ReserveTicketClient from './ReserveTicketClient'

export default async function ReserveTicketPage({ params }) {
  let museum = null
  
  try {
    museum = await prisma.museum.findUnique({
      where: { id: params.museumId }
    })
  } catch (error) {
    console.error('Error fetching museum data:', error)
    // Continue with null museum - the client will handle this gracefully
  }

  if (!museum) {
    notFound()
  }

  return <ReserveTicketClient museum={museum} />
}
