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
  const [availability, setAvailability] = useState(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
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

  const checkAvailability = async (date, time, section) => {
    if (!date || !time || !section || !museum?._id) return

    try {
      setCheckingAvailability(true)
      const response = await fetch(
        `/api/reservations/check-availability?date=${date}&time=${time}&section=${section}&museumId=${museum._id}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setAvailability(data)
      } else {
        const errorData = await response.json()
        console.error('Availability check failed:', errorData)
        // Set a fallback availability if database is not configured
        if (errorData.error === 'Database not configured') {
          setAvailability({
            available: true,
            isBooked: false,
            existingReservation: null
          })
        } else {
          setAvailability(null)
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      // Set fallback availability on network errors
      setAvailability({
        available: true,
        isBooked: false,
        existingReservation: null
      })
    } finally {
      setCheckingAvailability(false)
    }
  }

  // Check availability when date, time, or section changes
  useEffect(() => {
    if (formData.visit_date && formData.visit_time && selectedSection) {
      checkAvailability(formData.visit_date, formData.visit_time, selectedSection)
    }
  }, [formData.visit_date, formData.visit_time, selectedSection])

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

    // Check availability before submitting
    if (availability && !availability.available) {
      toast({
        title: 'Time Slot Already Booked',
        description: `This time slot is already booked by someone else. Please choose a different time.`,
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
        const errorData = await response.json()
        if (response.status === 409 && (errorData.error === 'Duplicate booking not allowed' || errorData.error === 'Time slot already booked')) {
          toast({
            title: 'Time Slot Already Booked',
            description: errorData.details || 'This time slot is already booked by someone else.',
            variant: 'destructive'
          })
          return
        } else {
          throw new Error(errorData.error || 'Failed to create reservation')
        }
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
        description: error.message || 'There was an error processing your reservation. Please try again.',
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
                <select
                  name="visit_time"
                  value={formData.visit_time}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                >
                  <option value="">Select a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="09:30">9:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="13:30">1:30 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="14:30">2:30 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="15:30">3:30 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Museum hours: 9:00 AM - 5:00 PM (last entry at 4:00 PM)
                </p>
              </div>

              {/* Availability Status */}
              {formData.visit_date && formData.visit_time && selectedSection && (
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  {checkingAvailability ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Checking availability...
                    </div>
                  ) : availability ? (
                    <div className={`text-sm font-medium ${availability.available ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {availability.available ? (
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          <span>This time slot is available for booking</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 dark:text-red-400">✗</span>
                            <span>This time slot is already booked</span>
                          </div>
                          {/* {availability.existingReservation && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                              Booked by: {availability.existingReservation.visitorName} ({availability.existingReservation.numberOfVisitors} visitors)
                            </div>
                          )} */}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            
            <button 
              type="submit" 
              disabled={isSubmitting || (availability && !availability.available)}
              className={`w-full px-4 py-4 rounded-lg text-white font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
                isSubmitting || (availability && !availability.available)
                  ? 'bg-gray-500 cursor-not-allowed opacity-75' 
                  : 'bg-primary hover:bg-primary-glow cursor-pointer hover:shadow-lg transform hover:scale-[1.02]'
              }`}
            >
              {isSubmitting && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span className={isSubmitting ? 'animate-pulse' : ''}>
                {isSubmitting ? 'Processing Reservation...' : 'Reserve Ticket'}
              </span>
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  )
}
