'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Download, LogOut, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import NextLink from 'next/link';
// STEP 1: আপনার প্রোজেক্ট অনুযায়ী সঠিক পাথ ব্যবহার করুন
import { useAuth } from '../context/AuthContext'; 
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig'; 

// Define a type for the custom Link component's props
type LinkProps = {
    href: string;
    children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'a'>;


export default function Navbar() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState('/#hero');
    // ★★★ FIX: Destructured 'userData' to access the user role correctly ★★★
    const { user, userData, initializing } = useAuth();
    const pathname = usePathname();

    // Reference to store observer
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Cleanup previous observer
        if (observer.current) {
            observer.current.disconnect();
        }

        // শুধুমাত্র হোমপেজে IntersectionObserver সেট আপ করা হবে
        if (pathname === '/') {
            observer.current = new IntersectionObserver(
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
            sections.forEach((section) => observer.current?.observe(section));
        } else {
            // অন্য কোনো পেজে থাকলে, সেই পেজের পাথ-কেই অ্যাকটিভ লিঙ্ক হিসেবে সেট করা হবে
            setActiveLink(pathname);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [pathname]); // pathname পরিবর্তন হলে Effect পুনরায় রান হবে

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('/#')) {
            e.preventDefault();
            const sectionId = href.substring(2);
            const section = document.getElementById(sectionId);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 80, // Navbar এর উচ্চতার জন্য অফসেট
                    behavior: 'smooth',
                });
                setActiveLink(href);
            }
        } else {
            setActiveLink(href);
        }
        setMobileMenuOpen(false);
    };
    
    const publicNavLinks = [
        { name: 'Home', href: '/#hero' },
        { name: 'Features', href: '/#features' },
        { name: 'Testimonials', href: '/#testimonials' },
        { name: 'Pricing', href: '/#pricing' },
        { name: 'FAQs', href: '/#faq' },
    ];

    const navLinks = [...publicNavLinks];
    // ★★★ FIX: Changed the condition to check for the role on 'userData' instead of 'user' ★★★
    if (user && userData && (userData.role === 'admin' || userData.role === 'superadmin')) {
        navLinks.push({ name: 'Dashboard', href: '/dashboard' });
    }

    const Link = ({ href, children, ...props }: LinkProps) => {
        if (href.startsWith('/#')) {
            return <a href={href} {...props}>{children}</a>;
        }
        return <NextLink href={href} {...props}>{children}</NextLink>;
    };

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
            isScrolled 
            ? 'bg-[#0D0915]/80 backdrop-blur-lg shadow-lg py-2' 
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
                                const isActive = activeLink === link.href;
                                return (
                                    <Link
                                        key={link.name} 
                                        href={link.href}
                                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkClick(e, link.href)} 
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
                            const isActive = activeLink === link.href;
                            return(
                                <Link
                                    key={link.name} 
                                    href={link.href} 
                                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkClick(e, link.href)}
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
