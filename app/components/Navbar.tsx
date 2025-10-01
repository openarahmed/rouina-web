// File: app/components/Navbar.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Download, LogOut, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import NextLink from 'next/link';

// STEP 1: Import your actual useAuth hook and Firebase functions
import { useAuth } from '../context/AuthContext'; // Path thik kore nin
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig'; // Path thik kore nin

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('/#hero');

  // STEP 2: Use the real user state from your AuthContext
  const { user, initializing } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // This observer updates the active link based on which section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(`/#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' } 
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // STEP 3: Use the real Firebase sign-out function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // Custom smooth scrolling function
  const handleLinkClick = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const sectionId = href.substring(2);
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 80, // Offset for fixed navbar
          behavior: 'smooth',
        });
        setActiveLink(href);
        setMobileMenuOpen(false);
      }
    } else {
      setActiveLink(href);
      setMobileMenuOpen(false);
    }
  };
  
  // Conditional Navigation Links
  const publicNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'FAQs', href: '/#faq' },
  ];

  let navLinks = [...publicNavLinks];

  if (user && (user.role === 'admin' || user.role === 'superadmin')) {
    navLinks.push({ name: 'Dashboard', href: '/dashboard' });
  }

  // Helper component to handle different link types
  const Link = ({ href, children, ...props }) => {
    if (href.startsWith('/#')) {
      return <a href={href} {...props}>{children}</a>;
    }
    return <NextLink href={href} {...props}>{children}</NextLink>;
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
        ? 'bg-black/70 backdrop-blur-lg shadow-lg py-2' 
        : 'bg-transparent pt-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          
          <div className="flex-shrink-0 z-10">
            <NextLink href="/" className="flex items-center space-x-3">
              <Image
                src="https://i.ibb.co/Nny0XrCt/logo.png"
                alt="Routina Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="font-bold text-2xl text-white hidden sm:block">Routina</span>
            </NextLink>
          </div>

          <div className="hidden md:flex absolute inset-x-0 justify-center">
            <div className="flex items-center justify-center gap-x-2 bg-white/10 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/10">
              {navLinks.map((link) => {
                const isActive = (activeLink === link.href && pathname === '/') || pathname === link.href;
                return (
                  <Link
                    key={link.name} 
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)} 
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 ${
                      isActive 
                      ? 'bg-[#6D46C1] text-white shadow-sm'
                      : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name === 'Dashboard' && <LayoutDashboard size={14} />}
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 z-10">
            {initializing ? (
              <div className="w-28 h-9 bg-white/10 rounded-full animate-pulse"></div>
            ) : user ? (
              <button onClick={handleSignOut} className="inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                <LogOut size={16} /> Log Out
              </button>
            ) : (
              <NextLink href="/signup" className="inline-flex items-center gap-2 bg-[#6D46C1] text-white hover:opacity-80 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 shadow-md">
                <Download size={16} /> Download
              </NextLink>
            )}
          </div>

          <div className="flex items-center md:hidden z-10">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6 text-white" /> : <Menu className="block h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg shadow-lg mx-4 mt-2 rounded-lg border border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = (activeLink === link.href && pathname === '/') || pathname === link.href;
              return(
                <Link
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive ? 'bg-[#6D46C1] text-white' : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              )}
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-white/10 px-4">
            {user ? (
              <button onClick={() => {handleSignOut(); setMobileMenuOpen(false);}} className="flex items-center justify-center gap-2 w-full bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-md text-base font-semibold">
                <LogOut size={18} /> Log Out
              </button>
            ) : (
              <NextLink href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full text-white px-4 py-2 rounded-md text-base font-semibold" style={{ backgroundColor: '#6D46C1' }}>
                <Download size={18} /> Download App
              </NextLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}