import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../integrations/supabase/client'
import QRCode from 'qrcode'
import Header from '../components/Header.jsx'
import { useToast } from '../hooks/use-toast'

export default function ReserveTicket() {
  const { museumId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [museum, setMuseum] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
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
    const urlParams = new URLSearchParams(window.location.search)
    const section = urlParams.get('section')
    if (section && sections[section]) {
      setSelectedSection(section)
    }
  }, [])

  useEffect(() => {
    const fetchMuseum = async () => {
      if (!museumId) {
        navigate('/museums')
        return
      }

      try {
        const { data, error } = await supabase
          .from('museums')
          .select('*')
          .eq('id', museumId)
          .maybeSingle()

        if (error) throw error
        
        if (!data) {
          toast({
            title: 'Museum not found',
            description: 'The requested museum could not be found.',
            variant: 'destructive'
          })
          navigate('/museums')
          return
        }
        
        setMuseum(data)
      } catch (error) {
        console.error('Error fetching museum:', error)
        toast({
          title: 'Error',
          description: 'Museum not found',
          variant: 'destructive'
        })
        navigate('/museums')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMuseum()
  }, [museumId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!museum) return

    setIsSubmitting(true)
    try {
      // Generate unique reservation code
      const reservationCode = Math.random().toString(36).substring(2, 10).toUpperCase()
      
      // Generate QR code data with all reservation details
      const qrData = JSON.stringify({
        code: reservationCode,
        name: formData.visitor_name,
        email: formData.visitor_email,
        date: formData.visit_date,
        time: formData.visit_time,
        section: sections[selectedSection]?.name,
        museum: museum.name,
        museumId: museum.id,
        numberOfVisitors: formData.number_of_visitors,
      })
      
      const qrCodeDataUrl = await QRCode.toDataURL(qrData)
      
      // Save to database
      const { data, error } = await supabase
        .from('reservations')
        .insert([
          {
            visitor_name: formData.visitor_name,
            visitor_email: formData.visitor_email,
            reservation_code: reservationCode,
            qr_code_data: qrCodeDataUrl,
            visit_date: formData.visit_date,
            visit_time: formData.visit_time,
            museum_section: selectedSection,
            museum_id: museum.id,
            number_of_visitors: formData.number_of_visitors,
          },
        ])
        .select(`
          *,
          museums (
            id,
            name,
            location,
            opening_hours,
            admission_price
          )
        `)
        .single()

      if (error) {
        throw error
      }

      toast({
        title: 'Reservation Confirmed!',
        description: 'Your museum ticket has been successfully reserved.',
        variant: 'success'
      })
      
      // Store reservation data and redirect to confirmation
      sessionStorage.setItem('reservation', JSON.stringify(data))
      navigate('/confirmation')
      
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

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Loading Museum...</h2>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e3f2fd',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    )
  }

  if (!museum) {
    return null
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Header />
      <div style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
        {/* Back Button */}
        <div style={{ marginBottom: '24px' }}>
          <button 
            onClick={() => navigate('/museums')}
            className="text-primary hover:text-primary-glow transition-colors text-sm"
          >
            ← Back to Museums
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-heritage bg-clip-text text-transparent">
            {museum.name}
          </h1>
          <p className="text-lg text-muted-foreground">{museum.description}</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '32px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>
              📅 Reserve Your Ticket
              {selectedSection && (
                <span style={{ marginLeft: '8px' }}>
                  {sections[selectedSection]?.icon} {sections[selectedSection]?.name}
                </span>
              )}
            </h2>
            <p style={{ color: '#64748b' }}>Book your ticket for an unforgettable museum experience</p>
          </div>
          
          {/* Museum Info Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc'
            }}>
              <span style={{ fontSize: '16px' }}>💰</span>
              <div>
                <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Admission</p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{museum.admission_price}</p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc'
            }}>
              <span style={{ fontSize: '16px' }}>🕒</span>
              <div>
                <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Hours</p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{museum.opening_hours}</p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc'
            }}>
              <span style={{ fontSize: '16px' }}>📍</span>
              <div>
                <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Location</p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{museum.location}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Museum Section Selection */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Museum Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
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
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Full Name
              </label>
              <input
                type="text"
                name="visitor_name"
                value={formData.visitor_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                type="email"
                name="visitor_email"
                value={formData.visitor_email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Number of Visitors
              </label>
              <select
                name="number_of_visitors"
                value={formData.number_of_visitors}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
                required
              >
                <option value={1}>1 person</option>
                <option value={2}>2 people</option>
                <option value={3}>3 people</option>
                <option value={4}>4 people</option>
                <option value={5}>5 people (max)</option>
              </select>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Maximum of 5 visitors per reservation
              </p>
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Visit Date
              </label>
              <input
                type="date"
                name="visit_date"
                value={formData.visit_date}
                onChange={handleInputChange}
                min={minDate}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Visit Time
              </label>
              <input
                type="time"
                name="visit_time"
                value={formData.visit_time}
                onChange={handleInputChange}
                min="09:00"
                max="16:00"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
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