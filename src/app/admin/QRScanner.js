'use client'

import { useEffect, useRef, useState } from 'react'

export default function QRScanner({ onScan }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    startScanning()
    return () => {
      stopScanning()
    }
  }, [])

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Start scanning for QR codes
      scanForQRCode()
    } catch (err) {
      setError('Camera access denied or not available')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
    setIsScanning(false)
  }

  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height)

        if (qrCode) {
          onScan(qrCode.data)
          stopScanning()
          return
        }
      }

      if (isScanning) {
        requestAnimationFrame(scan)
      }
    }

    scan()
  }

  // Simple QR code detection (you might want to use a library like jsQR)
  const jsQR = (data, width, height) => {
    // This is a simplified version - in production, use a proper QR library
    // For now, we'll simulate QR detection
    return null
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-64 bg-muted rounded-lg object-cover"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="hidden"
        />
        
        {/* QR Code overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border-2 border-white rounded-lg relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Position the QR code within the frame
        </p>
        {isScanning ? (
          <p className="text-sm text-green-600">Scanning...</p>
        ) : (
          <button
            onClick={startScanning}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
          >
            Start Scanning
          </button>
        )}
      </div>
    </div>
  )
}
