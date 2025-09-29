// File: app/components/dashboard/Header.tsx
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
    <header className="sticky top-0 z-40 flex w-full bg-white border-b border-gray-200">
      <div className="flex flex-grow items-center justify-between py-4 px-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="p-1.5 lg:hidden"
          >
            <Menu size={22} className="text-gray-600"/>
          </button>
          
          {/* */}
          <div className="hidden lg:block">
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2">
                <Search size={20} className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full max-w-xs bg-gray-100 rounded-md py-2 pl-11 pr-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>


        <div className="flex items-center gap-3 sm:gap-5">
          {/* */}
          <div className="relative">
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none">
              <Bell size={22} />
            </button>
          </div>

          {/* */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3"
            >
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black">
                  Admin User
                </span>
                <span className="block text-xs text-gray-500">Administrator</span>
              </span>

              {/* ★★★ পরিবর্তন: ছবির সাইজ h-10 w-10 থেকে h-12 w-12 করা হয়েছে ★★★ */}
              <span className="h-12 w-12 rounded-full">
                <Image
                  width={148} // ★★★ পরিবর্তন: 40 থেকে 48 করা হয়েছে
                  height={148} // ★★★ পরিবর্তন: 40 থেকে 48 করা হয়েছে
                  src={'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSJ8d4Nqh1j5UqCxwipt1pyMfjMMEA8S-dnsLLzv5VbfPqrk3Bpjh_gsT4aLPhRNNRSZ_BzieEVPCpB6mU'} // size=128 for better resolution
                  alt="User"
                  className="rounded-full w-full h-full object-cover"
                />
              </span>
              <ChevronDown size={20} className={`transition-transform duration-200 text-gray-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 flex w-60 flex-col rounded-lg border border-gray-200 bg-white shadow-lg">
                <ul className="flex flex-col gap-5 border-b border-gray-200 px-6 py-4">
                  <li>
                    <Link href="#" className="flex items-center gap-3.5 text-sm font-medium text-gray-700 duration-300 ease-in-out hover:text-purple-600">
                      <User size={18} /> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center gap-3.5 text-sm font-medium text-gray-700 duration-300 ease-in-out hover:text-purple-600">
                      <Settings size={18} /> Account Settings
                    </Link>
                  </li>
                </ul>
                <button className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium text-gray-700 duration-300 ease-in-out hover:text-purple-600">
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