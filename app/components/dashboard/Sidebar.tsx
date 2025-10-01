'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mail, User, Settings, BarChart3, Users, FilePlus, Newspaper, X, Home } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);

  // সাইডবারের বাইরে ক্লিক করলে বা Escape বাটন চাপলে সাইডবার বন্ধ করার জন্য useEffect
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Escape কী চাপলে সাইডবার বন্ধ হবে
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <>
      {/* */}
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-999 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      <aside
        ref={sidebar}
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white border-r border-gray-200 duration-300 ease-linear lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link 
            href="" 
            className="text-2xl font-bold text-purple-600"
            onClick={() => setSidebarOpen(false)} // ★★★ onClick যোগ করা হয়েছে ★★★
          >
            Routina Admin
          </Link>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="block lg:hidden text-gray-500 hover:text-purple-600"
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <X size={24} />
          </button>
        </div>

        {/* */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            {/* */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500">MENU</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <Link
                    href=""
                    onClick={() => setSidebarOpen(false)} // ★★★ onClick যোগ করা হয়েছে ★★★
                    className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 ${
                      pathname === '' && 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    onClick={() => setSidebarOpen(false)} // ★★★ onClick যোগ করা হয়েছে ★★★
                    className="group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100"
                  >
                    <BarChart3 size={18} />
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500">CLUB MANAGEMENT</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <Link
                    href="/requests"
                    onClick={() => setSidebarOpen(false)} // ★★★ onClick যোগ করা হয়েছে ★★★
                    className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 ${
                      pathname.includes('/requests') && 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    <Mail size={18} />
                    Club Requests
                  </Link>
                </li>
                <li>
                  <Link
                    href="/members"
                    onClick={() => setSidebarOpen(false)} // ★★★ onClick যোগ করা হয়েছে ★★★
                    className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 ${
                      pathname.includes('/members') && 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    <Users size={18} />
                    Members
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500">NEWS & EVENTS</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <Link
                    href="/news/create"
                    onClick={() => setSidebarOpen(false)} // ★★★ onClick যোগ করা হয়েছে ★★★
                    className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 ${
                      pathname.includes('/news/create') && 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    <FilePlus size={18} />
                    Create New
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    onClick={() => setSidebarOpen(false)} // ★★★ onClick যোগ করা হয়েছে ★★★
                    className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 ${
                      pathname === '/news' && 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    <Newspaper size={18} />
                    All News & Events
                  </Link>
                </li>
              </ul>
            </div>

            {/* */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500">OTHERS</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <Link
                    href="/"
                    onClick={() => setSidebarOpen(false)} // ★★★ onClick যোগ করা হয়েছে ★★★
                    className="group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100"
                  >
                    <Home size={18} />
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    onClick={() => setSidebarOpen(false)} // ★★★ onClick যোগ করা হয়েছে ★★★
                    className="group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    onClick={() => setSidebarOpen(false)} // ★★★ onClick যোগ করা হয়েছে ★★★
                    className="group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;