'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
  const [loadingStates, setLoadingStates] = useState({})

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => {
      // Only update if the state actually changed
      if (prev[key] === isLoading) {
        return prev
      }
      return {
        ...prev,
        [key]: isLoading
      }
    })
  }, [])

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false
  }, [loadingStates])

  return (
    <LoadingContext.Provider value={{ setLoading, isLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
