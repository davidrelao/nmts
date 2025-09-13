'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()

  return (
    <header className="bg-gradient-primary shadow-museum relative z-20">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link 
          href="/"
          className="text-white text-sm md:text-xl font-bold flex items-center gap-2 hover:text-accent transition-colors"
        >
          Museum Reservation System
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link 
            href="/"
            className={`text-base font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
              pathname === '/' 
                ? 'text-accent bg-white/10 shadow-heritage' 
                : 'text-white/90 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/museums"
            className={`text-base font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
              pathname === '/museums' 
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
