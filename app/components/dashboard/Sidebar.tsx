'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// ★★★ FIX: Removed unused icons (User, Settings, BarChart3, Home) ★★★
import { LayoutDashboard, Mail, Users, FilePlus, Newspaper, X, Briefcase, Lightbulb } from 'lucide-react';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const pathname = usePathname();
    const trigger = useRef<HTMLButtonElement>(null);
    const sidebar = useRef<HTMLElement>(null);

    // Close sidebar on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node))
                return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // Close sidebar on escape key press
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
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden ${
                    sidebarOpen ? 'block' : 'hidden'
                }`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            
            {/* Sidebar */}
            <aside
                ref={sidebar}
                className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-white border-r border-slate-200 duration-300 ease-linear lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between gap-2 px-6 py-5 lg:py-6">
                    <Link 
                        href="/" 
                        className="text-2xl font-bold text-[#4c0e4c]"
                        onClick={() => setSidebarOpen(false)}
                    >
                        Admin Panel
                    </Link>
                    
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="block lg:hidden text-slate-500 hover:text-[#6D46C1]"
                        aria-controls="sidebar"
                        aria-expanded={sidebarOpen}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                    <nav className="mt-4 py-4 px-4 lg:mt-6 lg:px-6">
                        
                        {/* Menu Group */}
                        <div>
                            <h3 className="mb-4 ml-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">MENU</h3>
                            <ul className="mb-6 flex flex-col gap-1.5">
                                <li>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group relative flex items-center gap-3 rounded-md py-2 px-4 font-medium text-slate-600 duration-300 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1] ${
                                            (pathname === '/' || pathname === '/dashboard') && 'bg-[#6D46C1]/10 text-[#6D46C1]'
                                        }`}
                                    >
                                        <LayoutDashboard size={18} />
                                        Dashboard
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Menu Group */}
                        <div>
                            <h3 className="mb-4 ml-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">CLUB MANAGEMENT</h3>
                            <ul className="mb-6 flex flex-col gap-1.5">
                                <li>
                                    <Link
                                        href="/requests"
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group relative flex items-center gap-3 rounded-md py-2 px-4 font-medium text-slate-600 duration-300 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1] ${
                                            pathname.includes('/requests') && 'bg-[#6D46C1]/10 text-[#6D46C1]'
                                        }`}
                                    >
                                        <Mail size={18} />
                                        Club Requests
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/members"
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group relative flex items-center gap-3 rounded-md py-2 px-4 font-medium text-slate-600 duration-300 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1] ${
                                            pathname.includes('/members') && 'bg-[#6D46C1]/10 text-[#6D46C1]'
                                        }`}
                                    >
                                        <Users size={18} />
                                        Members
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* NEWS & EVENTS Menu Group */}
                        <div>
                            <h3 className="mb-4 ml-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">NEWS & EVENTS</h3>
                            <ul className="mb-6 flex flex-col gap-1.5">
                                <li>
                                    <Link
                                        href="/news"
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group relative flex items-center gap-3 rounded-md py-2 px-4 font-medium text-slate-600 duration-300 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1] ${
                                            pathname === '/news' && 'bg-[#6D46C1]/10 text-[#6D46C1]'
                                        }`}
                                    >
                                        <Newspaper size={18} />
                                        All News & Events
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/news/create"
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group relative flex items-center gap-3 rounded-md py-2 px-4 font-medium text-slate-600 duration-300 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1] ${
                                            pathname.includes('/news/create') && 'bg-[#6D46C1]/10 text-[#6D46C1]'
                                        }`}
                                    >
                                        <FilePlus size={18} />
                                        Create New
                                    </Link>
                                </li>
                                
                            </ul>
                        </div>
                        
                        {/* JOBS Menu Group */}
                        <div>
                            <h3 className="mb-4 ml-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">JOBS</h3>
                            <ul className="mb-6 flex flex-col gap-1.5">
                                <li>
                                    <Link
                                        href="/jobs"
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group relative flex items-center gap-3 rounded-md py-2 px-4 font-medium text-slate-600 duration-300 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1] ${
                                            pathname === '/jobs' && 'bg-[#6D46C1]/10 text-[#6D46C1]'
                                        }`}
                                    >
                                        <Briefcase size={18} />
                                        All Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/jobs/create"
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group relative flex items-center gap-3 rounded-md py-2 px-4 font-medium text-slate-600 duration-300 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1] ${
                                            pathname.includes('/jobs/create') && 'bg-[#6D46C1]/10 text-[#6D46C1]'
                                        }`}
                                    >
                                        <FilePlus size={18} />
                                        Create New Job
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        
                        
                        {/* TIPS & GUIDES Menu Group */}
                        <div>
                                <h3 className="mb-4 ml-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">TIPS & GUIDES</h3>
                                <ul className="mb-6 flex flex-col gap-1.5">
                                    <li>
                                        <Link
                                            href="/tips"
                                            onClick={() => setSidebarOpen(false)}
                                            className={`group relative flex items-center gap-3 rounded-md py-2 px-4 font-medium text-slate-600 duration-300 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1] ${
                                            pathname === '/tips' && 'bg-[#6D46C1]/10 text-[#6D46C1]'
                                            }`}
                                        >
                                            <Lightbulb size={18} />
                                            All Tips
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/tips/create"
                                            onClick={() => setSidebarOpen(false)}
                                            className={`group relative flex items-center gap-3 rounded-md py-2 px-4 font-medium text-slate-600 duration-300 ease-in-out hover:bg-slate-100 hover:text-[#6D46C1] ${
                                            pathname.includes('/tips/create') && 'bg-[#6D46C1]/10 text-[#6D46C1]'
                                            }`}
                                        >
                                            <FilePlus size={18} />
                                            Create New Tip
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
