'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLoading } from '../contexts/LoadingContext'

export default function PageLoadingWrapper({ children }) {
  const pathname = usePathname()
  const { setLoading } = useLoading()

  useEffect(() => {
    // Set loading to true when component mounts
    setLoading(pathname, true)
    
    // Clear loading after a short delay to allow content to render
    const timer = setTimeout(() => {
      setLoading(pathname, false)
    }, 100) // Very short delay just to show loading state

    return () => {
      clearTimeout(timer)
      // Always clear loading on unmount
      setLoading(pathname, false)
    }
  }, [pathname, setLoading])

  return children
}
