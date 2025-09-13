'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DashboardOverview({ todaysReservations, stats, sectionStats, hourlyStats }) {
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  const getCurrentStats = () => {
    switch (selectedPeriod) {
      case 'week':
        return stats.week
      case 'month':
        return stats.month
      case 'total':
        return stats.total
      default:
        return stats.today
    }
  }

  const currentStats = getCurrentStats()

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${color} flex-shrink-0`}>
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Monitor museum operations and visitor analytics</p>
        </div>
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          {['today', 'week', 'month', 'total'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Reservations"
          value={currentStats.reservations}
          icon="📋"
          color="bg-blue-100"
          subtitle={`${selectedPeriod} bookings`}
        />
        <StatCard
          title="Total Visitors"
          value={currentStats.visitors}
          icon="👥"
          color="bg-green-100"
          subtitle={`${selectedPeriod} visitors`}
        />
        <StatCard
          title="Checked In"
          value={currentStats.checkedIn}
          icon="✅"
          color="bg-purple-100"
          subtitle={`${selectedPeriod} check-ins`}
        />
        <StatCard
          title="Check-in Rate"
          value={`${currentStats.reservations > 0 ? Math.round((currentStats.checkedIn / currentStats.reservations) * 100) : 0}%`}
          icon="📊"
          color="bg-orange-100"
          subtitle="Completion rate"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Section Popularity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Section Popularity (Today)</h3>
          <div className="space-y-3">
            {Object.entries(sectionStats).map(([section, visitors]) => (
              <div key={section} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {section === 'Fine Arts' ? '🎨' : section === 'Anthropology' ? '🏛️' : '🦕'}
                  </span>
                  <span className="font-medium text-gray-900">{section}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(visitors / Math.max(...Object.values(sectionStats))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">{visitors}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Hourly Distribution (Today)</h3>
          <div className="space-y-2">
            {Object.entries(hourlyStats)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([hour, visitors]) => (
                <div key={hour} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 w-16">
                    {hour}:00
                  </span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(visitors / Math.max(...Object.values(hourlyStats))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">{visitors}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Today's Reservations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Today's Reservations</h3>
            <Link 
              href="/admin/reservations"
              className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        
        {todaysReservations.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4">📋</div>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No reservations today</h4>
            <p className="text-sm sm:text-base text-gray-600">Check back later for new bookings</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todaysReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.visitorName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.visitorEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(reservation.visitTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {reservation.museumSection}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.numberOfVisitors}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.checkedIn ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✅ Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⏳ Pending
                        </span>
                      )}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!reservation.checkedIn && (
                        <button className="text-blue-600 hover:text-blue-900">
                          Check In
                        </button>
                      )}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 p-4">
              {todaysReservations.map((reservation) => (
                <div key={reservation.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{reservation.visitorName}</h4>
                      <p className="text-xs text-gray-500 truncate">{reservation.visitorEmail}</p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {reservation.checkedIn ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✅ Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{formatTime(reservation.visitTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Section:</span>
                      <span className="font-medium">{reservation.museumSection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visitors:</span>
                      <span className="font-medium">{reservation.numberOfVisitors}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link 
          href="/admin/scanner"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">📱</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">QR Scanner</h4>
              <p className="text-xs sm:text-sm text-gray-600">Check in visitors</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/admin/reservations"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">📋</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">Manage Reservations</h4>
              <p className="text-xs sm:text-sm text-gray-600">View and edit bookings</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/admin/reports"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">📈</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">View Reports</h4>
              <p className="text-xs sm:text-sm text-gray-600">Analytics and insights</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
