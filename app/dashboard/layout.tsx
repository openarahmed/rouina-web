// File: app/dashboard/layout.tsx
'use client';
import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // ★★★ পরিবর্তন: dark: ক্লাসগুলো সরানো হয়েছে ★★★
    <div className="bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* */}

        {/* */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* */}

          {/* */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* */}
        </div>
        {/* */}
      </div>
    </div>
  );
}