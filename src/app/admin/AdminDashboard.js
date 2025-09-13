'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/Toaster'
import QRScanner from './QRScanner'

export default function AdminDashboard({ todaysReservations, stats }) {
  const [reservations, setReservations] = useState(todaysReservations)
  const [showScanner, setShowScanner] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const { toast } = useToast()

  // Update stats when reservations change
  const currentStats = {
    totalReservations: reservations.length,
    totalVisitors: reservations.reduce((sum, res) => sum + res.numberOfVisitors, 0),
    checkedInCount: reservations.filter(res => res.checkedIn).length
  }

  const handleQRScan = async (qrData) => {
    try {
      const data = JSON.parse(qrData)
      const reservation = reservations.find(res => res.reservationCode === data.code)
      
      if (!reservation) {
        toast({
          title: 'Invalid QR Code',
          description: 'This QR code is not valid for today\'s reservations.',
          variant: 'destructive'
        })
        return
      }

      if (reservation.checkedIn) {
        toast({
          title: 'Already Checked In',
          description: `${reservation.visitorName} has already been checked in.`,
          variant: 'destructive'
        })
        return
      }

      setSelectedReservation(reservation)
      setShowScanner(false)
    } catch (error) {
      toast({
        title: 'Invalid QR Code',
        description: 'Could not read the QR code data.',
        variant: 'destructive'
      })
    }
  }

  const confirmCheckIn = async () => {
    if (!selectedReservation) return

    try {
      const response = await fetch(`/api/reservations/${selectedReservation.id}/checkin`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to check in')
      }

      // Update local state
      setReservations(prev => 
        prev.map(res => 
          res.id === selectedReservation.id 
            ? { ...res, checkedIn: true, checkedInAt: new Date().toISOString() }
            : res
        )
      )

      toast({
        title: 'Check-in Successful',
        description: `${selectedReservation.visitorName} has been checked in successfully.`,
        variant: 'success'
      })

      setSelectedReservation(null)
    } catch (error) {
      toast({
        title: 'Check-in Failed',
        description: 'There was an error processing the check-in.',
        variant: 'destructive'
      })
    }
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage museum reservations and track attendance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl shadow-museum p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reservations</p>
                <p className="text-3xl font-bold text-foreground">{currentStats.totalReservations}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-museum p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                <p className="text-3xl font-bold text-foreground">{currentStats.totalVisitors}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-museum p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Checked In</p>
                <p className="text-3xl font-bold text-foreground">{currentStats.checkedInCount}</p>
              </div>
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowScanner(true)}
            className="bg-primary hover:bg-primary-glow text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-heritage flex items-center gap-2"
          >
            📱 Scan QR Code
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg flex items-center gap-2"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Today's Reservations */}
        <div className="bg-card rounded-xl shadow-museum p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Today's Reservations</h2>
          
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reservations for today</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">Visitor</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Section</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Visitors</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b border-border/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{reservation.visitorName}</p>
                          <p className="text-sm text-muted-foreground">{reservation.visitorEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-foreground">{formatTime(reservation.visitTime)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          {reservation.museumSection}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-foreground">{reservation.numberOfVisitors}</p>
                      </td>
                      <td className="py-3 px-4">
                        {reservation.checkedIn ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            ✅ Checked In
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            ⏳ Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {!reservation.checkedIn && (
                          <button
                            onClick={() => {
                              setSelectedReservation(reservation)
                            }}
                            className="text-primary hover:text-primary-glow font-medium text-sm"
                          >
                            Check In
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QR Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Scan QR Code</h3>
                <button
                  onClick={() => setShowScanner(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <QRScanner onScan={handleQRScan} />
            </div>
          </div>
        )}

        {/* Check-in Confirmation Modal */}
        {selectedReservation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Confirm Check-in</h3>
              <div className="space-y-3 mb-6">
                <p className="text-foreground"><strong>Visitor:</strong> {selectedReservation.visitorName}</p>
                <p className="text-foreground"><strong>Email:</strong> {selectedReservation.visitorEmail}</p>
                <p className="text-foreground"><strong>Time:</strong> {formatTime(selectedReservation.visitTime)}</p>
                <p className="text-foreground"><strong>Section:</strong> {selectedReservation.museumSection}</p>
                <p className="text-foreground"><strong>Visitors:</strong> {selectedReservation.numberOfVisitors}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={confirmCheckIn}
                  className="flex-1 bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded-lg font-medium"
                >
                  Confirm Check-in
                </button>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
