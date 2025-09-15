'use client'

import { useState, useRef, useEffect } from 'react'
import { QrCode, CheckCircle, XCircle, RefreshCw, Camera } from 'lucide-react'
import QrScanner from 'qr-scanner'

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [qrInput, setQrInput] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // Working QR code detection using qr-scanner
  const detectQRCode = (videoElement) => {
    return new Promise((resolve) => {
      const qrScanner = new QrScanner(
        videoElement,
        (result) => {
          console.log('QR Code detected:', result.data)
          resolve(result.data)
          qrScanner.stop()
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      )
      
      qrScanner.start().catch(err => {
        console.error('QR Scanner error:', err)
        resolve(null)
      })
    })
  }

  const startScanning = async () => {
    try {
      setError('')
      setIsScanning(true)
      
      // Start QR detection using qr-scanner
      const qrData = await detectQRCode(videoRef.current)
      if (qrData) {
        await handleQRCode(qrData)
      }
      
    } catch (err) {
      console.error('QR Scanner error:', err)
      setError('QR Scanner failed to start')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const handleQRCode = async (qrData) => {
    setIsLoading(true)
    setError('')
    
    try {
      console.log('QR Code detected:', qrData) // Debug log
      
      // QR data should be the reservation code directly
      const reservationCode = qrData.trim()
      
      if (!reservationCode) {
        setScanResult({
          success: false,
          message: `Invalid QR code format. Detected: ${qrData}`
        })
        return
      }
      
      console.log('Navigating to reservation:', reservationCode) // Debug log
      
      // Navigate directly to the scan page
      window.location.href = `/admin/scan/${reservationCode}`
      
    } catch (err) {
      console.error('QR processing error:', err) // Debug log
      setScanResult({
        success: false,
        message: `Error processing QR code: ${err.message}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetScanner = () => {
    setScanResult(null)
    setError('')
    stopScanning()
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
        {!isScanning && !scanResult && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Scan</h3>
            <p className="text-gray-600 mb-6">Click the button below to start scanning QR codes</p>
            <button
              onClick={startScanning}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Start Scanning
            </button>
          </div>
        )}

        {isScanning && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-white border-dashed w-48 h-48 rounded-lg flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-white opacity-50" />
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">Position the QR code within the frame</p>
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
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing check-in...</p>
          </div>
        )}

        {scanResult && (
          <div className="text-center py-8">
            {scanResult.success ? (
              <div className="space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">Check-in Successful!</h3>
                <p className="text-gray-600">{scanResult.message}</p>
                {scanResult.reservation && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                    <h4 className="font-medium text-green-900 mb-2">Visitor Details:</h4>
                    <p className="text-sm text-green-700">
                      <strong>Name:</strong> {scanResult.reservation.visitorName}<br />
                      <strong>Email:</strong> {scanResult.reservation.visitorEmail}<br />
                      <strong>Reservation Code:</strong> {scanResult.reservation.reservationCode}<br />
                      <strong>Visit Date:</strong> {new Date(scanResult.reservation.visitDate).toLocaleDateString()}<br />
                      <strong>Visit Time:</strong> {scanResult.reservation.visitTime}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">Check-in Failed</h3>
                <p className="text-gray-600">{scanResult.message}</p>
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

      {/* Manual Input Option */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Entry (Alternative)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Reservation Code, Email, or Full QR JSON
            </label>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g., ABC123, user@example.com, or full QR JSON"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-xs text-gray-500">
            <p><strong>Test with these examples:</strong></p>
            <p>• Reservation Code: <code>YI6QEFHX</code></p>
            <p>• Email: <code>handsup@gabriela.com</code></p>
            <p>• Full QR JSON: <code>{"{"}"type":"RESERVATION","code":"YI6QEFHX","name":"Gabriela","email":"handsup@gabriela.com"{"}"}</code></p>
          </div>
          <button
            onClick={handleManualCode}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Processing...' : 'Process Code'}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Click "Start Scanning" to activate the camera</li>
          <li>• Position the visitor's QR code within the scanning frame</li>
          <li>• Or use the manual entry option above</li>
          <li>• The system will automatically detect and process the QR code</li>
          <li>• Visitors will be checked in automatically upon successful scan</li>
        </ul>
      </div>
    </div>
  )
}