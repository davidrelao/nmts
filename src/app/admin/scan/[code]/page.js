'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Calendar, Clock, Users, MapPin, User, Mail } from 'lucide-react'
import { useToast } from '@/components/Toaster'

export default function QRScanPage() {
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkingIn, setCheckingIn] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (params.code) {
      fetchReservation(params.code)
    }
  }, [params.code])

  const fetchReservation = async (code) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reservations/${code}`)
      
      if (response.ok) {
        const data = await response.json()
        setReservation(data)
      } else {
        toast({
          title: "Reservation Not Found",
          description: "The scanned QR code does not match any reservation.",
          variant: "destructive"
        })
        router.push('/admin/scanner')
      }
    } catch (error) {
      console.error('Error fetching reservation:', error)
      toast({
        title: "Error",
        description: "Failed to load reservation details.",
        variant: "destructive"
      })
      router.push('/admin/scanner')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    if (!reservation) return

    try {
      setCheckingIn(true)
      const response = await fetch(`/api/reservations/${reservation.reservationCode}/checkin`, {
        method: 'POST',
      })

      if (response.ok) {
        const updatedReservation = await response.json()
        setReservation(updatedReservation)
        
        toast({
          title: "Check-in Successful",
          description: `${reservation.visitorName} has been checked in successfully!`,
          variant: "success"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Check-in Failed",
          description: error.error || "Failed to check in visitor.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error checking in:', error)
      toast({
        title: "Error",
        description: "Failed to check in visitor.",
        variant: "destructive"
      })
    } finally {
      setCheckingIn(false)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reservation details...</p>
        </div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reservation Not Found</h1>
          <p className="text-gray-600 mb-6">The scanned QR code does not match any reservation.</p>
          <button
            onClick={() => router.push('/admin/scanner')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Scanner
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reservation Details</h1>
              <p className="text-sm sm:text-base text-gray-600">QR Code scanned successfully</p>
            </div>
            <div className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${
              reservation.checkedIn 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {reservation.checkedIn ? 'Checked In' : 'Pending Check-in'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Visitor Information */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Visitor Information
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500">Name</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{reservation.visitorName}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{reservation.visitorEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500">Number of Visitors</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {reservation.numberOfVisitors} {reservation.numberOfVisitors === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Visit Details
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500">Visit Date</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{formatDate(reservation.visitDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500">Visit Time</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{reservation.visitTime}</p>
                </div>
              </div>
              
              {reservation.museum && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">Museum</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{reservation.museum.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{reservation.museum.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Check-in Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-4 sm:mt-6">
          <div className="text-center">
            {reservation.checkedIn ? (
              <div>
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Already Checked In</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  This visitor was checked in on {new Date(reservation.checkedInAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Ready for Check-in</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Verify the visitor's identity and click the button below to check them in.
                </p>
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors flex items-center mx-auto"
                >
                  {checkingIn ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Checking In...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span>Check In Visitor</span>
                    </>
                  )}
                </button>
              </div>
            )}
            
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => router.push('/admin/scanner')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors"
              >
                Scan Another QR Code
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
