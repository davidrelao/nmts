'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  ClipboardList, 
  Users, 
  QrCode, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'

const AdminDashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    // Set login status to false in localStorage
    localStorage.setItem('isLoggedIn', 'false')
    
    // Reload the page to trigger redirect to login
    window.location.reload()
  }

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      description: 'Overview & Analytics'
    },
    {
      name: 'Reservations',
      href: '/admin/reservations',
      icon: ClipboardList,
      description: 'Manage Bookings'
    },
    {
      name: 'Visitors',
      href: '/admin/visitors',
      icon: Users,
      description: 'Visitor Management'
    },
    {
      name: 'QR Scanner',
      href: '/admin/scanner',
      icon: QrCode,
      description: 'Check-in Scanner'
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: TrendingUp,
      description: 'Analytics & Reports'
    },
    // {
    //   name: 'Settings',
    //   href: '/admin/settings',
    //   icon: Settings,
    //   description: 'System Settings'
    // }
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:flex lg:flex-col lg:flex-shrink-0
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="ml-2 text-base sm:text-lg font-semibold text-gray-900">Museum Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="text-xs text-gray-500 truncate hidden sm:block">{item.description}</div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1">
              <User className="w-4 h-4 text-blue-700 flex-shrink-0" />
              <span className="ml-2 text-xs sm:text-sm font-medium text-gray-700 truncate">Admin User</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-2 sm:px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
            <div className="flex items-center min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex-shrink-0"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="ml-2 sm:ml-4 lg:ml-0 min-w-0 flex-1">
                <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">
                  <span className="hidden sm:inline">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      timeZone: 'Asia/Manila'
                    })} (PST)
                  </span>
                  <span className="sm:hidden">
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      timeZone: 'Asia/Manila'
                    })}
                  </span>
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
    </AuthGuard>
  )
}

export default AdminDashboardLayout
