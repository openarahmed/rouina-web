// File: app/components/Navbar.tsx

"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

// --- Mock Auth Hook for Demonstration ---
// TODO: You will replace this with your actual useAuth hook from Firebase later.
const useAuth = () => {
  // To test the logged-in view, change `null` to an object like `{ name: 'Shakil' }`
  const state = {
    user: null, 
    signOut: () => console.log('Signing out...'),
  };
  return state;
};
// --- End Mock Auth Hook ---

// Make sure you are using "export default" here
export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors">
              Routina
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-semibold transition-shadow shadow-sm hover:shadow-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
             {user ? (
              <div className="px-2 space-y-2">
                 <Link href="/dashboard" className="block text-center w-full bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-base font-semibold">
                  Dashboard
                </Link>
                 <button
                  onClick={signOut}
                  className="block text-center w-full bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md text-base font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-2">
                <Link href="/login" className="block text-center w-full bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md text-base font-semibold">
                  Log In
                </Link>
                <Link href="/signup" className="block text-center w-full bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-base font-semibold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}