'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/Toaster'

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [recentScans, setRecentScans] = useState([])
  const { toast } = useToast()

  const handleQRScan = async (qrData) => {
    try {
      const data = JSON.parse(qrData)
      
      // Call check-in API
      const response = await fetch(`/api/reservations/${data.id}/checkin`, {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        
        // Add to recent scans
        setRecentScans(prev => [{
          id: Date.now(),
          visitorName: result.visitorName,
          time: new Date().toLocaleTimeString(),
          status: 'success'
        }, ...prev.slice(0, 9)]) // Keep only last 10

        toast({
          title: 'Check-in Successful',
          description: `${result.visitorName} has been checked in successfully.`,
          variant: 'success'
        })
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Check-in failed')
      }
    } catch (error) {
      // Add failed scan to recent scans
      setRecentScans(prev => [{
        id: Date.now(),
        visitorName: 'Unknown',
        time: new Date().toLocaleTimeString(),
        status: 'error',
        error: error.message
      }, ...prev.slice(0, 9)])

      toast({
        title: 'Check-in Failed',
        description: error.message || 'Invalid QR code or reservation not found.',
        variant: 'destructive'
      })
    }
  }

  const startScanning = () => {
    setIsScanning(true)
  }

  const stopScanning = () => {
    setIsScanning(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Code Scanner</h1>
          <p className="text-gray-600 mt-1">Scan visitor QR codes for check-in</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">
            {isScanning ? 'Scanning...' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Scanner</h3>
              <p className="text-gray-600">Position the QR code within the frame below</p>
            </div>

            {!isScanning ? (
              <div className="text-center">
                <div className="w-80 h-80 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <p className="text-gray-600 text-lg">Scanner Ready</p>
                    <p className="text-gray-500 text-sm mt-2">Click start to begin scanning</p>
                  </div>
                </div>
                <button
                  onClick={startScanning}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
                >
                  Start Scanning
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative w-80 h-80 mx-auto bg-gray-900 rounded-lg overflow-hidden mb-6 border-2 border-gray-700">
                  {/* Simulated camera view */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-2">📹</div>
                      <p className="text-sm">Camera Active</p>
                    </div>
                  </div>
                  
                  {/* QR Code overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-60 h-60 border-2 border-white rounded-lg relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={stopScanning}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Stop Scanning
                  </button>
                  <button
                    onClick={() => handleQRScan('{"id":"test","code":"TEST123","visitorName":"Test Visitor"}')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Test Scan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h3>
            
            {recentScans.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-3">📋</div>
                <p className="text-gray-600 text-sm">No recent scans</p>
                <p className="text-gray-500 text-xs mt-1">Scanned QR codes will appear here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className={`p-3 rounded-lg border ${
                      scan.status === 'success'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {scan.visitorName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {scan.time}
                        </p>
                        {scan.error && (
                          <p className="text-xs text-red-600 mt-1 truncate">
                            {scan.error}
                          </p>
                        )}
                      </div>
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ml-2 ${
                        scan.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Scans</span>
                <span className="text-lg font-semibold text-gray-900">
                  {recentScans.filter(s => s.status === 'success').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Failed Scans</span>
                <span className="text-lg font-semibold text-gray-900">
                  {recentScans.filter(s => s.status === 'error').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-lg font-semibold text-gray-900">
                  {recentScans.length > 0 
                    ? Math.round((recentScans.filter(s => s.status === 'success').length / recentScans.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
