import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const museumId = searchParams.get('id')
    
    if (museumId) {
      // Get specific museum by ID
      const museum = await prisma.museum.findUnique({
        where: { id: museumId }
      })
      
      if (!museum) {
        return NextResponse.json(
          { error: 'Museum not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(museum)
    }
    
    // Get all museums
    const museums = await prisma.museum.findMany({
      orderBy: { created_at: 'desc' }
    })
    
    return NextResponse.json(museums)
  } catch (error) {
    console.error('Error fetching museums:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      location,
      opening_hours,
      admission_price,
      image_url
    } = body

    // Validate required fields
    if (!name || !location || !opening_hours) {
      return NextResponse.json(
        { error: 'Missing required fields: name, location, opening_hours' },
        { status: 400 }
      )
    }

    // Create museum in database
    const museum = await prisma.museum.create({
      data: {
        name,
        description,
        location,
        openingHours: opening_hours,
        admissionPrice: admission_price,
        imageUrl: image_url,
      }
    })

    return NextResponse.json(museum)
  } catch (error) {
    console.error('Error creating museum:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
