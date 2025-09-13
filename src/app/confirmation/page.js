'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfirmationPage() {
  const [reservation, setReservation] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const data = sessionStorage.getItem('reservation')
    if (data) {
      setReservation(JSON.parse(data))
    } else {
      router.push('/museums')
    }
  }, [router])

  if (!reservation) {
    return null
  }

  const downloadTicket = () => {
    // Create a canvas to generate the full ticket
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    
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
    ctx.fillText(`Code: ${reservation.reservationCode}`, canvas.width / 2, 180)
    
    // Add museum name
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('Museum:', 50, 250)
    ctx.fillStyle = '#374151'
    ctx.font = '20px Arial'
    ctx.fillText(reservation.museum ? reservation.museum.name : 'Museum Ticket', 50, 280)
    
    // Add visitor details
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 20px Arial'
    ctx.fillText('Visitor Details:', 50, 330)
    
    ctx.fillStyle = '#374151'
    ctx.font = '18px Arial'
    ctx.fillText(`Name: ${reservation.visitorName}`, 50, 360)
    ctx.fillText(`Email: ${reservation.visitorEmail}`, 50, 390)
    ctx.fillText(`Number of Visitors: ${reservation.numberOfVisitors} ${reservation.numberOfVisitors === 1 ? 'person' : 'people'}`, 50, 420)
    
    // Add visit details
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 20px Arial'
    ctx.fillText('Visit Details:', 50, 470)
    
    ctx.fillStyle = '#374151'
    ctx.font = '18px Arial'
    ctx.fillText(`Date: ${formatDate(reservation.visitDate)}`, 50, 500)
    ctx.fillText(`Time: ${reservation.visitTime}`, 50, 530)
    
    if (reservation.museum) {
      ctx.fillText(`Location: ${reservation.museum.location}`, 50, 560)
      ctx.fillText(`Hours: ${reservation.museum.openingHours}`, 50, 590)
      ctx.fillText(`Admission: ${reservation.museum.admissionPrice}`, 50, 620)
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
      link.download = `museum-ticket-${reservation.reservationCode}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    
    qrImage.src = reservation.qrCodeData
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
    <div className="min-h-screen bg-gradient-subtle">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
              🎉 Reservation Confirmed!
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">Your museum ticket is ready</p>
          </div>

          <div className="bg-card rounded-xl shadow-museum p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-4 sm:mb-6">
              <div className="bg-accent/10 text-accent inline-block px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                {reservation.reservationCode}
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                {reservation.museum ? reservation.museum.name : 'Museum Ticket'}
              </h2>
            </div>
          
            {/* Ticket Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg">👤</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-semibold text-foreground mb-1">Visitor Name</p>
                    <p className="text-sm sm:text-base text-muted-foreground break-words">{reservation.visitorName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg">📧</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-semibold text-foreground mb-1">Email</p>
                    <p className="text-sm sm:text-base text-muted-foreground break-words">{reservation.visitorEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg">📅</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-semibold text-foreground mb-1">Visit Date</p>
                    <p className="text-sm sm:text-base text-muted-foreground">{formatDate(reservation.visitDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg">👥</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-semibold text-foreground mb-1">Number of Visitors</p>
                    <p className="text-sm sm:text-base text-muted-foreground">{reservation.numberOfVisitors} {reservation.numberOfVisitors === 1 ? 'person' : 'people'}</p>
                  </div>
                </div>

                {reservation.museum && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg">📍</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-semibold text-foreground mb-1">Location</p>
                      <p className="text-sm sm:text-base text-muted-foreground break-words">{reservation.museum.location}</p>
                    </div>
                  </div>
                )}
              </div>
            
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-muted rounded-lg">
                <img 
                  src={reservation.qrCodeData} 
                  alt="Ticket QR Code"
                  className="w-32 h-32 sm:w-40 sm:h-40 mb-3 sm:mb-4"
                />
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>📱</span>
                  <span>Scan at entrance</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-muted rounded-lg p-4 sm:p-6 mt-4 sm:mt-6">
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-3">Important Information</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Present this QR code at the museum entrance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Arrive 15 minutes before your visit time</span>
                </li>
                {reservation.museum && (
                  <>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Hours: {reservation.museum.openingHours}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Admission: {reservation.museum.admissionPrice}</span>
                    </li>
                  </>
                )}
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Keep your reservation code: <strong className="text-foreground">{reservation.reservationCode}</strong></span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button 
                onClick={downloadTicket}
                className="w-full bg-primary hover:bg-primary-glow text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold transition-colors duration-200 shadow-museum hover:shadow-heritage"
              >
                📥 Download Full Ticket
              </button>
              
              <button 
                onClick={() => router.push('/museums')}
                className="w-full bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold transition-colors duration-200"
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
