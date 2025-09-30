import Link from 'next/link';
import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

// SocialLink component for individual social media icons
const SocialLink = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-white/90 hover:text-white transition-colors"
  >
    <Icon className="h-5 w-5" />
  </a>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  // Replace with your actual app URL
  const appUrl = "https://your-app-url.com"; 

  return (
    <footer className="bg-[#6d46c1] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Main CTA for App Download */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Branding and QR Code */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <a href="/" className="flex items-center space-x-3 mb-4">
            <div className='bg-white  p-1 rounded-lg'>
                <img
                className="h-10 w-auto "
                src="https://i.ibb.co/Nny0XrCt/logo.png"
                alt="Routina Logo"
              />
            </div>
              <span className="font-bold text-2xl text-white">Routina</span>
            </a>
            <p className="mt-2 text-white/90 max-w-xs">
              Start building your habits today. Get the app now!
            </p>
            <div className="mt-6 bg-white p-3 rounded-lg shadow-md border border-gray-200 hidden lg:block">
              <img
                className="h-24 w-24"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${appUrl}`}
                alt="QR Code to download the app"
              />
            </div>
          </div>

          {/* Middle Section: App Store Badges and Links */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Take Routina with you
            </h3>
            
            <p className="mt-2 text-white/90">
              Download the app and start achieving your goals from anywhere.
            </p>
            
            {/* ===== NEW PARAGRAPH ADDED HERE ===== */}
           

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <a href="#download-ios" className="transform hover:scale-105 transition-transform">
                <img className="h-15 w-auto" src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1276560000" alt="Download on the App Store" />
              </a>
              <a href="#download-android" className="transform hover:scale-105 transition-transform">
                <img className="h-22 w-auto" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" />
              </a>
              
            </div>
             <p className="mt-8 text-base text-white/90 max-w-lg">
              Stay on track with your personal and professional goals with the Routina mobile app. 
            </p>
          </div>

          {/* Right Section: Company Links */}
          <div className="lg:col-span-2 justify-self-center lg:justify-self-start">
             <h3 className="text-base font-semibold text-white tracking-wider uppercase">
               Company
             </h3>
             <ul className="mt-4 space-y-3">
               <li><Link href="/about" className="text-base text-white/90 hover:text-white">About Us</Link></li>
               <li><Link href="/blog" className="text-base text-white/90 hover:text-white">Blog</Link></li>
               <li><Link href="/contact" className="text-base text-white/90 hover:text-white">Contact</Link></li>
               <li><Link href="/terms" className="text-base text-white/90 hover:text-white">Terms of Service</Link></li>
               <li><Link href="/privacy" className="text-base text-white/90 hover:text-white">Privacy Policy</Link></li>
             </ul>
          </div>
        </div>

        {/* ===== BOTTOM BAR REVERTED AND RE-STYLED ===== */}
        <div className="py-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-white/90 text-center sm:text-left">
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