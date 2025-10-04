'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, Bell, User, Settings, LogOut, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Header = (props: HeaderProps) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Effect to handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        // THEME UPDATE: Removed dark mode classes. Using a light slate border.
        <header className="sticky top-0 z-40 flex w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="flex flex-grow items-center justify-between py-3 px-4 md:px-6 2xl:px-11">

                {/* Left Section: Sidebar Toggle & Search */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Sidebar Toggle Button for Mobile */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        // THEME UPDATE: Simplified classes for light theme
                        className="p-2 text-slate-500 rounded-lg hover:bg-slate-200/70 focus:outline-none lg:hidden transition-colors"
                    >
                        <Menu size={22} />
                    </button>

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:block">
                        <div className="relative">
                            <span className="absolute top-1/2 left-4 -translate-y-1/2">
                                <Search size={20} className="text-slate-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Type to search..."
                                // THEME UPDATE: Light theme search bar with primary color focus ring
                                className="w-full max-w-xs bg-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6D46C1] focus:border-[#6D46C1] border border-transparent transition"
                            />
                        </div>
                    </div>
                </div>


                {/* Right Section: Icons & User Profile */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* Mobile Search Icon */}
                    <button className="p-2 text-slate-500 rounded-full hover:bg-slate-200/70 focus:outline-none block lg:hidden transition-colors">
                        <Search size={22} />
                    </button>

                    {/* Notification Button */}
                    <div className="relative">
                        {/* THEME UPDATE: Simplified ring for light background */}
                        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                        <button className="p-2 text-slate-500 rounded-full hover:bg-slate-200/70 focus:outline-none transition-colors">
                            <Bell size={22} />
                        </button>
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-200/70 transition-colors"
                        >
                            <span className="hidden text-right lg:block">
                                {/* BRANDING: Using secondary color for user name */}
                                <span className="block text-sm font-medium text-[#4c0e4c]">
                                    Admin User
                                </span>
                                <span className="block text-xs text-slate-500">Administrator</span>
                            </span>

                            <span className="h-9 w-9 md:h-10 md:w-10 rounded-full">
                                <Image
                                    width={40}
                                    height={40}
                                    src={'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSJ8d4Nqh1j5UqCxwipt1pyMfjMMEA8S-dnsLLzv5VbfPqrk3Bpjh_gsT4aLPhRNNRSZ_BzieEVPCpB6mU'}
                                    alt="User"
                                    className="rounded-full w-full h-full object-cover"
                                />
                            </span>
                            <ChevronDown size={20} className={`transition-transform duration-200 text-slate-500 hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            // THEME UPDATE: Light theme dropdown styling
                            <div className="absolute right-0 mt-4 flex w-60 flex-col rounded-xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-xl animate-fade-in-down">
                                <ul className="flex flex-col gap-1 border-b border-slate-200 p-2">
                                    <li>
                                        {/* BRANDING: Using primary color on hover for dropdown links */}
                                        <Link href="#" className="flex items-center gap-3.5 rounded-md px-3 py-2 text-sm font-medium text-slate-700 duration-200 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1]">
                                            <User size={18} /> My Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="flex items-center gap-3.5 rounded-md px-3 py-2 text-sm font-medium text-slate-700 duration-200 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1]">
                                            <Settings size={18} /> Account Settings
                                        </Link>
                                    </li>
                                </ul>
                                <button className="flex items-center gap-3.5 p-2 m-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 duration-200 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1]">
                                    <LogOut size={18} /> Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;