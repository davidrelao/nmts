import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ReserveTicketClient from './ReserveTicketClient'

export default async function ReserveTicketPage({ params }) {
  const museum = await prisma.museum.findUnique({
    where: { id: params.museumId }
  })

  if (!museum) {
    notFound()
  }

  return <ReserveTicketClient museum={museum} />
}
