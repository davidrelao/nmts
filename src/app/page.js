import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div 
        className="relative text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/national-museum-ph.webp')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm inline-block px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6 text-xs sm:text-sm text-white font-medium border border-white/30">
            🏛️ Premium Museum Experience
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg leading-tight">
            Discover Art & Culture
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow px-4">
            Reserve tickets to world-class museums and immerse yourself in extraordinary collections, 
            from ancient artifacts to contemporary masterpieces.
          </p>
        
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link 
              href="/museums" 
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors duration-200 shadow-heritage hover:shadow-museum text-center"
            >
              🏛️ Explore Museums
            </Link>
            
            <a 
              href="#features" 
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold border-2 border-white/30 hover:bg-white/20 transition-colors duration-200 text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
              Why Choose Our Platform?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Experience seamless museum visits with our digital ticketing system
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-card p-6 sm:p-8 rounded-xl shadow-museum text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-accent/10 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                🏛️
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">
                Curated Collections
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Access to premium museums featuring world-renowned art, history, and cultural exhibitions from around the globe.
              </p>
            </div>
            
            <div className="bg-card p-6 sm:p-8 rounded-xl shadow-museum text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-accent/10 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                👥
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">
                Skip the Lines
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Reserve your tickets in advance and enjoy priority access with our digital QR code system.
              </p>
            </div>
            
            <div className="bg-card p-6 sm:p-8 rounded-xl shadow-museum text-center hover:-translate-y-1 transition-transform duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-accent/10 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                ⭐
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">
                Premium Experience
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Enjoy a seamless visit with digital tickets, personalized recommendations, and exclusive member benefits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-gradient-heritage/5 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-foreground">
          Ready to Start Your Journey?
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          Join thousands of art enthusiasts and culture lovers who trust our platform for their museum experiences.
        </p>
        
        <Link 
          href="/museums" 
          className="inline-block bg-primary hover:bg-primary-glow text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors duration-200 shadow-heritage hover:shadow-museum"
        >
          Get Started →
        </Link>
      </div>
    </div>
  )
}
