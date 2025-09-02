import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()

  return (
    <header className="bg-gradient-primary shadow-museum relative z-20">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link 
          to="/"
          className="text-white text-2xl font-bold flex items-center gap-2 hover:text-accent transition-colors"
        >
          🏛️ National Museum
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link 
            to="/"
            className={`text-base font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === '/' 
                ? 'text-accent bg-white/10 shadow-heritage' 
                : 'text-white/90 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/museums"
            className={`text-base font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === '/museums' 
                ? 'text-accent bg-white/10 shadow-heritage' 
                : 'text-white/90 hover:text-white hover:bg-white/5'
            }`}
          >
            Museums
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header