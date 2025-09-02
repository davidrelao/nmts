import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import museumImage from '../../assets/national-museum-ph.webp'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      {/* Hero Section */}
      <div 
        className="relative text-center px-5 py-32 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${museumImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        <div className="relative z-10">
          <div className="bg-white/20 backdrop-blur-sm inline-block px-4 py-2 rounded-full mb-6 text-sm text-white font-medium border border-white/30">
            🏛️ Premium Museum Experience
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Discover Art & Culture
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Reserve tickets to world-class museums and immerse yourself in extraordinary collections, 
            from ancient artifacts to contemporary masterpieces.
          </p>
        
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/museums" 
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-heritage hover:shadow-museum"
            >
              🏛️ Explore Museums
            </Link>
            
            <a 
              href="#features" 
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-white/30 hover:bg-white/20 transition-colors duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="px-5 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience seamless museum visits with our digital ticketing system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-museum text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center text-2xl">
                🏛️
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Curated Collections
              </h3>
              <p className="text-muted-foreground">
                Access to premium museums featuring world-renowned art, history, and cultural exhibitions from around the globe.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-museum text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center text-2xl">
                👥
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Skip the Lines
              </h3>
              <p className="text-muted-foreground">
                Reserve your tickets in advance and enjoy priority access with our digital QR code system.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-museum text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center text-2xl">
                ⭐
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Premium Experience
              </h3>
              <p className="text-muted-foreground">
                Enjoy a seamless visit with digital tickets, personalized recommendations, and exclusive member benefits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-5 py-20 bg-gradient-heritage/5 text-center">
        <h2 className="text-4xl font-bold mb-6 text-foreground">
          Ready to Start Your Journey?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of art enthusiasts and culture lovers who trust our platform for their museum experiences.
        </p>
        
        <Link 
          to="/museums" 
          className="bg-primary hover:bg-primary-glow text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-heritage hover:shadow-museum"
        >
          Get Started →
        </Link>
      </div>
    </div>
  )
}