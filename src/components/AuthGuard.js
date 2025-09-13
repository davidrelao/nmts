'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check localStorage for authentication status
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true)
    } else {
      // Redirect to login page
      router.push('/admin/login')
    }
    
    setIsLoading(false)
  }, [router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Only render children if authenticated
  if (isAuthenticated) {
    return children
  }

  // Return null if not authenticated (will redirect)
  return null
}
