'use client';

import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';
// ★★★ FIX: Importing Link and Image from Next.js ★★★
import Link from 'next/link';
import Image from 'next/image';

const SocialLink = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-[#D1D5DB] hover:text-[#6D46C1] transition-colors"
  >
    <Icon className="h-5 w-5" />
  </a>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appUrl = "https://your-app-url.com"; 

  return (
    <footer className="bg-[#0D0915] text-[#D1D5DB] border-t border-[#2E284D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Main CTA for App Download */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Branding and QR Code */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* ★★★ FIX: Replaced <a> with <Link> for internal navigation ★★★ */}
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className=''>
                  {/* ★★★ FIX: Replaced <img> with <Image> for optimization ★★★ */}
                  <Image
                    src="https://i.postimg.cc/QtXBXKxz/hicon.png"
                    alt="Routina Logo"
                    width={40}
                    height={40}
                  />
              </div>
              <span className="font-bold text-2xl text-[#F3F4F6]">Routina</span>
            </Link>
            <p className="mt-2 max-w-xs">
              Start building your habits today. Get the app now!
            </p>
            <div className="mt-6 bg-white p-3 rounded-lg shadow-md border border-gray-200 hidden lg:block">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${appUrl}`}
                alt="QR Code to download the app"
                width={96}
                height={96}
              />
            </div>
          </div>

          {/* Middle Section: App Store Badges and Links */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="text-2xl font-bold text-[#F3F4F6] tracking-tight">
              Take Routina with you
            </h3>
            
            <p className="mt-2">
              Download the app and start achieving your goals from anywhere.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <a href="#download-ios" className="transform hover:scale-105 transition-transform">
                <Image width={180} height={60} src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1276560000" alt="Download on the App Store" />
              </a>
              <a href="#download-android" className="transform hover:scale-105 transition-transform w-[70%] ">
                <Image width={180} height={53} src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" />
              </a>
            </div>
              <p className="mt-8 text-base max-w-lg">
                Stay on track with your personal and professional goals with the Routina mobile app. 
              </p>
          </div>

          {/* Right Section: Company Links */}
          <div className="lg:col-span-2 justify-self-center lg:justify-self-start">
              <h3 className="text-base font-semibold text-[#F3F4F6] tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {/* ★★★ FIX: Replaced all <a> tags with <Link> for internal pages ★★★ */}
                <li><Link href="/about" className="text-base hover:text-[#6D46C1]">About Us</Link></li>
                <li><Link href="/blogs" className="text-base hover:text-[#6D46C1]">Blog</Link></li>
                <li><Link href="/terms" className="text-base hover:text-[#6D46C1]">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-base hover:text-[#6D46C1]">Privacy Policy</Link></li>
              </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#2E284D] flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-center sm:text-left">
            &copy; {currentYear} Routina, Inc. All rights reserved.
          </p>
          <div className="flex space-x-5 mt-4 sm:mt-0">
            <SocialLink href="https://twitter.com" icon={Twitter} />
            <SocialLink href="https://facebook.com" icon={Facebook} />
            <SocialLink href="https://instagram.com" icon={Instagram} />
            <SocialLink href="https://linkedin.com" icon={Linkedin} />
          </div>
        </div>
      </div>
    </footer>
  );
}