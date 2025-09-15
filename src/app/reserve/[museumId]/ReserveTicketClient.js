'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/Toaster'

export default function ReserveTicketClient({ museum }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSection, setSelectedSection] = useState('')
  const [formData, setFormData] = useState({
    visitor_name: '',
    visitor_email: '',
    visit_date: '',
    visit_time: '09:00',
    number_of_visitors: 1
  })

  const sections = {
    'fine-arts': { name: 'Fine Arts', icon: '🎨' },
    'anthropology': { name: 'Anthropology', icon: '🏛️' },
    'natural-history': { name: 'Natural History', icon: '🦕' }
  }

  useEffect(() => {
    // Get section from URL query params
    const section = searchParams.get('section')
    if (section && sections[section]) {
      setSelectedSection(section)
    }
  }, [searchParams])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_visitors' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.visitor_name || !formData.visitor_email || !formData.visit_date || !formData.visit_time || !selectedSection || !formData.number_of_visitors) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields and select a museum section',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          museum_id: museum._id,
          museum_section: selectedSection,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create reservation')
      }

      const reservation = await response.json()

      toast({
        title: 'Reservation Confirmed!',
        description: 'Your museum ticket has been successfully reserved.',
        variant: 'success'
      })
      
      // Store reservation data and redirect to confirmation
      sessionStorage.setItem('reservation', JSON.stringify(reservation))
      router.push('/confirmation')
      
    } catch (error) {
      console.error('Error creating reservation:', error)
      toast({
        title: 'Reservation Error',
        description: 'There was an error processing your reservation. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get tomorrow's date as minimum
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="px-5 py-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => router.push('/museums')}
              className="text-primary hover:text-primary-glow transition-colors text-sm font-medium"
            >
              ← Back to Museums
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              🏛️ {museum.name}
            </h1>
            <p className="text-lg text-muted-foreground">{museum.description}</p>
          </div>

          <div className="bg-card rounded-xl shadow-museum p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2 text-foreground">
                📅 Reserve Your Ticket
                {selectedSection && (
                  <span className="ml-2">
                    {sections[selectedSection]?.icon} {sections[selectedSection]?.name}
                  </span>
                )}
              </h2>
              <p className="text-muted-foreground">Book your ticket for an unforgettable museum experience</p>
            </div>
          
            {/* Museum Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <span className="text-lg">💰</span>
                <div>
                  <p className="font-semibold text-foreground mb-1">Admission</p>
                  <p className="text-sm text-muted-foreground">{museum.admissionPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <span className="text-lg">🕒</span>
                <div>
                  <p className="font-semibold text-foreground mb-1">Hours</p>
                  <p className="text-sm text-muted-foreground">{museum.openingHours}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <span className="text-lg">📍</span>
                <div>
                  <p className="font-semibold text-foreground mb-1">Location</p>
                  <p className="text-sm text-muted-foreground">{museum.location}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Museum Section Selection */}
              <div>
                <label className="block font-semibold text-foreground mb-2">
                  Museum Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                >
                  <option value="">Select a section</option>
                  {Object.entries(sections).map(([key, section]) => (
                    <option key={key} value={key}>
                      {section.icon} {section.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="visitor_name"
                  value={formData.visitor_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full p-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                />
            </div>
            
              <div>
                <label className="block font-semibold text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="visitor_email"
                  value={formData.visitor_email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full p-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-2">
                  Number of Visitors
                </label>
                <select
                  name="number_of_visitors"
                  value={formData.number_of_visitors}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                >
                  <option value={1}>1 person</option>
                  <option value={2}>2 people</option>
                  <option value={3}>3 people</option>
                  <option value={4}>4 people</option>
                  <option value={5}>5 people (max)</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum of 5 visitors per reservation
                </p>
              </div>
              
              <div>
                <label className="block font-semibold text-foreground mb-2">
                  Visit Date
                </label>
                <input
                  type="date"
                  name="visit_date"
                  value={formData.visit_date}
                  onChange={handleInputChange}
                  min={minDate}
                  className="w-full p-3 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-2">
                  Visit Time
                </label>
                <input
                  type="time"
                  name="visit_time"
                  value={formData.visit_time}
                  onChange={handleInputChange}
                  min="09:00"
                  max="16:00"
                  className="w-full p-3 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Museum hours: 9:00 AM - 5:00 PM (last entry at 4:00 PM)
                </p>
              </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full px-4 py-4 rounded-lg text-white font-semibold text-base transition-colors ${
                isSubmitting 
                  ? 'bg-muted cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-glow cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Reserve Ticket'}
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  )
}
