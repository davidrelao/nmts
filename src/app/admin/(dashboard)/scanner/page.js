'use client'

import { useState, useRef, useEffect } from 'react'
import { QrCode, CheckCircle, XCircle, RefreshCw, Camera, Upload } from 'lucide-react'

export default function ImprovedQRScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const videoRef = useRef(null)
  const qrScannerRef = useRef(null)
  const fileInputRef = useRef(null)

  // Import qr-scanner dynamically (client-side only)
  const [QrScanner, setQrScanner] = useState(null)

  useEffect(() => {
    // Dynamically import qr-scanner on client side
    import('qr-scanner').then((module) => {
      setQrScanner(() => module.default)
    })
  }, [])

  const startScanning = async () => {
    if (!QrScanner) {
      setError('QR Scanner is loading, please try again')
      return
    }

    try {
      setError('')
      setIsScanning(true)
      
      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera()
      if (!hasCamera) {
        throw new Error('No camera found')
      }

      // Create QR scanner instance
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        result => {
          // console.log('QR Code detected:', result.data)
          handleQRCode(result.data)
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
          calculateScanRegion: (video) => {
            // Create a centered square scan region
            const smallerDimension = Math.min(video.videoWidth, video.videoHeight)
            const scanRegionSize = Math.round(0.6 * smallerDimension)
            
            return {
              x: Math.round((video.videoWidth - scanRegionSize) / 2),
              y: Math.round((video.videoHeight - scanRegionSize) / 2),
              width: scanRegionSize,
              height: scanRegionSize,
            }
          }
        }
      )

      await qrScannerRef.current.start()
      
    } catch (err) {
      console.error('Camera error:', err)
      setError(`Camera error: ${err.message}`)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop()
      qrScannerRef.current.destroy()
      qrScannerRef.current = null
    }
    setIsScanning(false)
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!QrScanner) {
      setError('QR Scanner is loading, please try again')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Scan QR code from uploaded image
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true
      })
      
      // console.log('QR Code from image:', result.data)
      await handleQRCode(result.data)
      
    } catch (err) {
      console.error('Image scan error:', err)
      setError(`Could not detect QR code in image: ${err.message}`)
    } finally {
      setIsLoading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleQRCode = async (qrData) => {
    // Stop scanning when QR code is detected
    if (isScanning) {
      stopScanning()
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // console.log('Processing QR Code:', qrData)
      
      let reservationCode = ''
      
      // Try to parse as JSON first (new format)
      try {
        const qrDataObj = JSON.parse(qrData)
        // console.log('Parsed QR data:', qrDataObj)
        
        if (qrDataObj.type === 'RESERVATION' && qrDataObj.code) {
          reservationCode = qrDataObj.code
        } else {
          throw new Error('Invalid QR code format')
        }
      } catch (parseError) {
        // console.log('JSON parse failed, trying fallback:', parseError)
        
        // Check if it's just an email address
        if (qrData.includes('@') && qrData.includes('.')) {
          // console.log('QR code contains email, searching by email:', qrData)
          const response = await fetch(`/api/reservations?email=${encodeURIComponent(qrData)}`)
          if (response.ok) {
            const reservations = await response.json()
            if (reservations.length > 0) {
              const latestReservation = reservations[0]
              reservationCode = latestReservation.reservationCode
              // console.log('Found reservation by email:', latestReservation.reservationCode)
            } else {
              throw new Error('No reservation found for this email')
            }
          } else {
            throw new Error('Failed to search by email')
          }
        } else {
          // Fallback: try direct reservation code or remove prefix
          reservationCode = qrData.replace(/^RESERVATION:/, '').trim()
          if (!reservationCode) {
            reservationCode = qrData.trim()
          }
        }
      }
      
      // console.log('Final reservation code:', reservationCode)
      
      if (!reservationCode) {
        setScanResult({
          success: false,
          message: `Invalid QR code format. Detected data: "${qrData}"`
        })
        return
      }
      
      // Redirect to the scan page with the reservation code
      window.location.href = `/admin/scan/${reservationCode}`
      
    } catch (err) {
      console.error('QR processing error:', err)
      setScanResult({
        success: false,
        message: `Processing error: ${err.message}. QR data: "${qrData}"`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetScanner = () => {
    setScanResult(null)
    setError('')
  }

  const handleManualCode = async () => {
    if (!manualCode.trim()) {
      setError('Please enter a reservation code or email')
      return
    }
    
    await handleQRCode(manualCode.trim())
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  if (!QrScanner) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading QR Scanner...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <QrCode className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
        <p className="text-gray-600">Scan visitor QR codes to check them in</p>
      </div>

      {/* Scanner Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {!isScanning && !scanResult && !isLoading && (
          <div className="text-center py-12 space-y-6">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Scan</h3>
            <p className="text-gray-600 mb-6">Choose how you want to scan the QR code</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startScanning}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Camera className="h-5 w-5 mr-2" />
                Use Camera
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Image
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {isScanning && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-80 object-cover"
              />
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">Position the QR code within the highlighted frame</p>
              <button
                onClick={stopScanning}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Stop Scanning
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing QR code...</p>
          </div>
        )}

        {scanResult && (
          <div className="text-center py-8">
            {scanResult.success ? (
              <div className="space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">Success!</h3>
                <p className="text-gray-600">{scanResult.message}</p>
                {scanResult.reservation && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                    <h4 className="font-medium text-green-900 mb-2">Visitor Details:</h4>
                    <p className="text-sm text-green-700">
                      <strong>Name:</strong> {scanResult.reservation.visitorName}<br />
                      <strong>Email:</strong> {scanResult.reservation.visitorEmail}<br />
                      <strong>Code:</strong> {scanResult.reservation.reservationCode}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">Processing Failed</h3>
                <p className="text-gray-600 text-sm">{scanResult.message}</p>
              </div>
            )}
            
            <button
              onClick={resetScanner}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan Another
            </button>
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Troubleshooting:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• If camera scanning doesn't work, try uploading an image of the QR code</li>
          <li>• Make sure the QR code is well-lit and not blurry</li>
          <li>• The QR code should fill most of the scanning area</li>
          <li>• If all else fails, use the manual entry option</li>
        </ul>
      </div>
    </div>
  )
}