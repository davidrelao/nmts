'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function MuseumsClient({ museum }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const sections = [
    {
      id: 'fine-arts',
      name: 'Fine Arts',
      description: 'Explore masterpieces of painting, sculpture, and decorative arts from around the world',
      location: 'Padre Burgos Ave, Ermita, Manila, 1000 Metro Manila, Philippines',
      icon: '🎨'
    },
    {
      id: 'anthropology', 
      name: 'Anthropology',
      description: 'Discover human cultures, societies, and civilizations throughout history',
      location: 'Padre Burgos Drive Rizal Park, Teodoro F. Valencia Cir, Ermita, Manila, 1000 Metro Manila, Philippines',
      icon: '🏛️'
    },
    {
      id: 'natural-history',
      name: 'Natural History', 
      description: 'Journey through Earth\'s natural wonders, from dinosaurs to modern ecosystems',
      location: 'Teodoro F. Valencia Cir, Ermita, Manila, 1000 Metro Manila, Philippines',
      icon: '🦕'
    }
  ]

  const handleReserveTicket = (sectionId) => {
    if (!museum) return
    router.push(`/reserve/${museum._id}?section=${sectionId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <h2 className="text-xl mb-4 text-foreground">Loading Museums...</h2>
          <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section with Museum Image */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/national-museum-ph.webp')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              🏛️ National Museum
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow">
              Explore three distinct collections: Fine Arts, Anthropology, and Natural History
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-12">
        <div className="max-w-7xl mx-auto">
          {!museum ? (
            <div className="text-center py-12">
              <h3 className="text-muted-foreground mb-4">Museum not found</h3>
              <p className="text-muted-foreground/70">Check back later!</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Museum Info */}
              <div className="bg-card rounded-xl shadow-museum p-8 mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">{museum.name}</h2>
                <p className="text-muted-foreground mb-6">{museum.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span className="text-muted-foreground text-sm">{museum.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕒</span>
                    <span className="text-muted-foreground text-sm">{museum.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span className="text-muted-foreground text-sm">{museum.admissionPrice}</span>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <h3 className="text-2xl font-semibold mb-8 text-center text-foreground">
                Choose Your Section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="bg-card rounded-xl shadow-museum overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-heritage cursor-pointer group"
                  >
                    <div className="p-8 text-center">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{section.icon}</div>
                      <h4 className="text-xl font-semibold mb-3 text-foreground">
                        {section.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {section.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mb-6 italic">
                        📍 {section.location}
                      </p>
                      <button 
                        onClick={() => handleReserveTicket(section.id)}
                        className="bg-primary hover:bg-primary-glow text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-heritage"
                      >
                        Reserve Tickets
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
