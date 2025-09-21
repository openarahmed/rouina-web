import Link from 'next/link';
import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

const SocialLink = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
    <Icon className="h-6 w-6" />
  </a>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: Branding & Social */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-bold text-white">
              <Link href="/" className="hover:opacity-80 transition-opacity">Routina</Link>
            </h2>
            <p className="mt-2 text-gray-400 text-sm max-w-xs">
              Organize your life, achieve your goals, and build lasting habits.
            </p>
            <div className="mt-6 flex space-x-6">
              <SocialLink href="https://twitter.com" icon={Twitter} />
              <SocialLink href="https://facebook.com" icon={Facebook} />
              <SocialLink href="https://instagram.com" icon={Instagram} />
              <SocialLink href="https://linkedin.com" icon={Linkedin} />
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/#features" className="text-base text-gray-400 hover:text-white">Features</Link></li>
              <li><Link href="/pricing" className="text-base text-gray-400 hover:text-white">Pricing</Link></li>
              <li><Link href="/demo" className="text-base text-gray-400 hover:text-white">Watch Demo</Link></li>
              <li><Link href="/download" className="text-base text-gray-400 hover:text-white">Download</Link></li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/about" className="text-base text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/blog" className="text-base text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link href="/contact" className="text-base text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>

 {/* Column 4: Legal Links */}
<div>
  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
  <ul className="mt-4 space-y-4">
    {/* This link should now work correctly */}
    <li><Link href="/terms" className="text-base text-gray-400 hover:text-white">Terms of Service</Link></li>
    <li><Link href="/privacy" className="text-base text-gray-400 hover:text-white">Privacy Policy</Link></li>
  </ul>
</div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-500 text-center">
            &copy; {currentYear} Routina, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}