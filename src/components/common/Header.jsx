import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = ({ 
  heroTitle = "Services", 
  heroSubtitle = "Luxury in the Skies",
  backgroundImage = "https://jetrique.com/wp-content/uploads/2025/06/about-us.webp"
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: "Let's Go", href: '/lets-go' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Services', href: '/services', active: true },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      {/* Header Content */}
      <div className="relative z-10">
        <header className="text-white">
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                {/* Logo */}
                <div className="flex items-center">
                  <a href="/" className="text-2xl font-bold text-white font-mono">
                    Jetrique
                  </a>
                </div>

                {/* Navigation */}
                <nav className="flex items-center space-x-8">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                        item.active
                          ? 'text-lime-400'
                          : 'text-white hover:text-lime-400'
                      }`}
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                  <a
                    href="#"
                    className="text-white hover:text-lime-400 transition-colors duration-200"
                  >
                    Log in
                  </a>
                  <a
                    href="#"
                    className="bg-lime-400 text-gray-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-lime-300 transition-colors duration-200 uppercase"
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center">
                  <a href="/" className="text-xl font-bold text-white font-mono">
                    Jetrique
                  </a>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-lime-400 hover:text-lime-300 transition-colors duration-200"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Mobile Navigation */}
              {isMenuOpen && (
                <div className="bg-white border-t border-gray-200 absolute left-0 right-0 top-16">
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                          item.active
                            ? 'text-lime-600 bg-lime-50'
                            : 'text-gray-700 hover:text-lime-600 hover:bg-lime-50'
                        }`}
                      >
                        {item.name}
                      </a>
                    ))}
                    <div className="border-t pt-4 mt-4">
                      <a
                        href="#"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-lime-600"
                      >
                        Log in
                      </a>
                      <a
                        href="#"
                        className="block mx-3 mt-2 bg-lime-400 text-gray-900 px-4 py-2 rounded-md text-sm font-bold text-center hover:bg-lime-300 transition-colors duration-200 uppercase"
                      >
                        Sign up
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex items-center justify-center min-h-screen pt-20 lg:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              {/* Main Title */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold font-mono text-lime-400 leading-tight tracking-wider">
                {heroTitle}
              </h1>
              
              {/* Subtitle */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-white max-w-2xl mx-auto leading-relaxed">
                {heroSubtitle}
              </h2>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Header;