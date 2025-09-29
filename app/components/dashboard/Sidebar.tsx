'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// ★★★ Notun icon import kora hoyeche ★★★
import { LayoutDashboard, Mail, User, Settings, BarChart3, Users, FilePlus, Newspaper } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white border-r border-gray-200 duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/dashboard" className="text-2xl font-bold text-purple-600">
          Routina Admin
        </Link>
      </div>

      {/* <!-- SIDEBAR MENU --> */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* ★★★ MENU GROUP 1: MAIN ★★★ */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500">MENU</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 ${
                    pathname === '/dashboard' && 'bg-purple-50 text-purple-600'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100"
                >
                  <BarChart3 size={18} />
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* ★★★ MENU GROUP 2: CLUB MANAGEMENT ★★★ */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500">CLUB MANAGEMENT</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/dashboard/requests"
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 ${
                    pathname.includes('/dashboard/requests') && 'bg-purple-50 text-purple-600'
                  }`}
                >
                  <Mail size={18} />
                  Club Requests
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/members"
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 ${
                    pathname.includes('/dashboard/members') && 'bg-purple-50 text-purple-600'
                  }`}
                >
                  <Users size={18} />
                  Members
                </Link>
              </li>
            </ul>
          </div>
          
          {/* ★★★ MENU GROUP 3: NEWS & EVENTS ★★★ */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500">NEWS & EVENTS</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/dashboard/news/create"
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 ${
                    pathname.includes('/dashboard/news/create') && 'bg-purple-50 text-purple-600'
                  }`}
                >
                  <FilePlus size={18} />
                  Create New
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/news"
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 ${
                    pathname === '/dashboard/news' && 'bg-purple-50 text-purple-600'
                  }`}
                >
                  <Newspaper size={18} />
                  All News & Events
                </Link>
              </li>
            </ul>
          </div>

          {/* ★★★ MENU GROUP 4: OTHERS ★★★ */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500">OTHERS</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="#"
                  className="group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100"
                >
                  <User size={18} />
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="#"
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
  );
};

export default Sidebar;

