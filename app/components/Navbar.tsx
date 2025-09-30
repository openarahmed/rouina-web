// File: app/components/Navbar.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { Menu, X, Download, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const pathname = usePathname();
  const { user, initializing } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      // useRouter is not needed if we are just reloading
      window.location.href = '/'; 
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'FAQs', href: '/faq' },
  ];

  return (
    <header className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out pt-4 ${
        isScrolled 
        ? 'bg-black/70 backdrop-blur-lg shadow-lg border-b border-white/10 pt-0' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 z-10">
            <Link href="/" className="text-2xl font-bold transition-colors" style={{ color: '#6D46C1' }}>
              Routina
            </Link>
          </div>

          {/* Centered Navigation Links with your original Scroll Effect */}
          <div className="hidden md:flex absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 justify-center">
            <div className={`
              flex items-center justify-center transition-all duration-500 ease-in-out gap-x-2
              ${!isScrolled ? 'bg-white/10 backdrop-blur-md max-w-fit rounded-full shadow-md border border-white/10 p-1.5' : ''}
            `}>
              {navLinks.map((link) => {
                const isActive = (pathname === link.href);
                return (
                  <Link
                    key={link.name} 
                    href={link.href} 
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive 
                      ? 'bg-white text-gray-900 shadow-sm' // Active link style
                      : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>


          {/* Right Side Button */}
          <div className="hidden md:flex items-center gap-4 z-10">
            {initializing ? (
              <div className="w-28 h-9 bg-white/10 rounded-full animate-pulse"></div>
            ) : user ? (
              <button onClick={handleSignOut} className="inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                <LogOut size={16} /> Log Out
              </button>
            ) : (
              <Link href="/signup" className="inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                <Download size={16} /> Download
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden z-10">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg shadow-lg mx-4 mt-2 rounded-lg border border-white/10" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name} 
                  href={link.href} 
                  onClick={()=> setMobileMenuOpen(false)} 
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                    ? 'bg-white text-black'
                    : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-white/10 px-4">
            {user ? (
              <button onClick={()=>{handleSignOut(); setMobileMenuOpen(false);}} className="flex items-center justify-center gap-2 w-full bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-md text-base font-semibold">
                <LogOut size={18} /> Log Out
              </button>
            ) : (
              <Link href="/signup" onClick={()=> setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full text-white px-4 py-2 rounded-md text-base font-semibold" style={{ backgroundColor: '#6D46C1' }}>
                <Download size={18} /> Download App
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}