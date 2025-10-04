'use client';
import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import ProtectedRoute from '../components/ProtectedRoute'; // প্রোটেক্টেড রুট এখানে ইম্পোর্ট করা হলো

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // ★★★ পরিবর্তন: সম্পূর্ণ লেআউটটি এখন ProtectedRoute দিয়ে র‍্যাপ করা হয়েছে ★★★
    <ProtectedRoute>
      <div className="bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* Sidebar */}

          {/* Content area */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* Header */}

            {/* Main content */}
            <main>
              <div className="p-6 lg:p-8 h-full">
                {children}
              </div>
            </main>
            {/* Main content */}
          </div>
          {/* Content area */}
        </div>
      </div>
    </ProtectedRoute>
  );
}

