import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

export default function Confirmation() {
  const [reservation, setReservation] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const data = sessionStorage.getItem('reservation')
    if (data) {
      setReservation(JSON.parse(data))
    } else {
      navigate('/museums')
    }
  }, [])

  if (!reservation) {
    return null
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = `museum-ticket-${reservation.reservation_code}.png`
    link.href = reservation.qr_code_data
    link.click()
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
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
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Reservation Confirmed!
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Your museum ticket is ready</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '32px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              backgroundColor: '#e3f2fd',
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {reservation.reservation_code}
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
              {reservation.museums ? reservation.museums.name : 'Museum Ticket'}
            </h2>
          </div>
          
          {/* Ticket Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>👤</span>
                <div>
                  <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Visitor Name</p>
                  <p style={{ color: '#64748b', margin: 0 }}>{reservation.visitor_name}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>📧</span>
                <div>
                  <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Email</p>
                  <p style={{ color: '#64748b', margin: 0 }}>{reservation.visitor_email}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>📅</span>
                <div>
                  <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Visit Date</p>
                  <p style={{ color: '#64748b', margin: 0 }}>{formatDate(reservation.visit_date)}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>👥</span>
                <div>
                  <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Number of Visitors</p>
                  <p style={{ color: '#64748b', margin: 0 }}>{reservation.number_of_visitors} {reservation.number_of_visitors === 1 ? 'person' : 'people'}</p>
                </div>
              </div>

              {reservation.museums && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px' }}>📍</span>
                  <div>
                    <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Location</p>
                    <p style={{ color: '#64748b', margin: 0 }}>{reservation.museums.location}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* QR Code */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px'
            }}>
              <img 
                src={reservation.qr_code_data} 
                alt="Ticket QR Code"
                style={{ width: '160px', height: '160px', marginBottom: '16px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b' }}>
                <span>📱</span>
                <span>Scan at entrance</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '24px',
            marginTop: '24px'
          }}>
            <h3 style={{ fontWeight: '600', marginBottom: '12px' }}>Important Information</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b', lineHeight: '1.6' }}>
              <li>Present this QR code at the museum entrance</li>
              <li>Arrive 15 minutes before your visit time</li>
              {reservation.museums && (
                <>
                  <li>Hours: {reservation.museums.opening_hours}</li>
                  <li>Admission: {reservation.museums.admission_price}</li>
                </>
              )}
              <li>Keep your reservation code: <strong>{reservation.reservation_code}</strong></li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '24px'
          }}>
            <button 
              onClick={downloadQR}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📥 Download Ticket
            </button>
            
            <button 
              onClick={() => navigate('/museums')}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#2563eb',
                padding: '16px',
                borderRadius: '8px',
                border: '2px solid #2563eb',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ← Book Another Ticket
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}