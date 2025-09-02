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

  const downloadTicket = () => {
    // Create a canvas to generate the full ticket
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Set canvas size for the ticket
    canvas.width = 800
    canvas.height = 1000
    
    // Set background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add border
    ctx.strokeStyle = '#2563eb'
    ctx.lineWidth = 4
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)
    
    // Add header
    ctx.fillStyle = '#2563eb'
    ctx.fillRect(0, 0, canvas.width, 120)
    
    // Header text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('MUSEUM TICKET', canvas.width / 2, 50)
    ctx.font = 'bold 24px Arial'
    ctx.fillText('Reservation Confirmed', canvas.width / 2, 85)
    
    // Add reservation code
    ctx.fillStyle = '#e3f2fd'
    ctx.fillRect(50, 140, canvas.width - 100, 60)
    ctx.fillStyle = '#2563eb'
    ctx.font = 'bold 28px Arial'
    ctx.fillText(`Code: ${reservation.reservation_code}`, canvas.width / 2, 180)
    
    // Add museum name
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('Museum:', 50, 250)
    ctx.fillStyle = '#374151'
    ctx.font = '20px Arial'
    ctx.fillText(reservation.museums ? reservation.museums.name : 'Museum Ticket', 50, 280)
    
    // Add visitor details
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 20px Arial'
    ctx.fillText('Visitor Details:', 50, 330)
    
    ctx.fillStyle = '#374151'
    ctx.font = '18px Arial'
    ctx.fillText(`Name: ${reservation.visitor_name}`, 50, 360)
    ctx.fillText(`Email: ${reservation.visitor_email}`, 50, 390)
    ctx.fillText(`Number of Visitors: ${reservation.number_of_visitors} ${reservation.number_of_visitors === 1 ? 'person' : 'people'}`, 50, 420)
    
    // Add visit details
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 20px Arial'
    ctx.fillText('Visit Details:', 50, 470)
    
    ctx.fillStyle = '#374151'
    ctx.font = '18px Arial'
    ctx.fillText(`Date: ${formatDate(reservation.visit_date)}`, 50, 500)
    ctx.fillText(`Time: ${reservation.visit_time}`, 50, 530)
    
    if (reservation.museums) {
      ctx.fillText(`Location: ${reservation.museums.location}`, 50, 560)
      ctx.fillText(`Hours: ${reservation.museums.opening_hours}`, 50, 590)
      ctx.fillText(`Admission: ${reservation.museums.admission_price}`, 50, 620)
    }
    
    // Add QR code
    const qrImage = new Image()
    qrImage.onload = () => {
      // Draw QR code on the right side
      const qrSize = 200
      const qrX = canvas.width - qrSize - 50
      const qrY = 650
      
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)
      
      // Add QR label
      ctx.fillStyle = '#374151'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Scan at entrance', qrX + qrSize/2, qrY + qrSize + 30)
      
      // Add instructions
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 18px Arial'
      ctx.textAlign = 'left'
      ctx.fillText('Important Information:', 50, 700)
      
      ctx.fillStyle = '#374151'
      ctx.font = '14px Arial'
      ctx.fillText('• Present this ticket at the museum entrance', 50, 730)
      ctx.fillText('• Arrive 15 minutes before your visit time', 50, 755)
      ctx.fillText('• Keep your reservation code safe', 50, 780)
      
      // Download the complete ticket
      const link = document.createElement('a')
      link.download = `museum-ticket-${reservation.reservation_code}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    
    qrImage.src = reservation.qr_code_data
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-heritage bg-clip-text text-transparent">
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
              onClick={downloadTicket}
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
              📥 Download Full Ticket
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