'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// এই কম্পোনেন্টটি অ্যাডমিন পেজগুলোকে র‍্যাপ করবে
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userData, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // যদি লোডিং শেষ হয় এবং ব্যবহারকারীর ডেটা না থাকে অথবা সে অ্যাডমিন না হয়
    if (!initializing && (!userData || (userData.role !== 'admin' && userData.role !== 'superadmin'))) {
      // তাকে লগইন পেজে পাঠিয়ে দাও
      router.push('/login');
    }
  }, [userData, initializing, router]);

  // যদি লোডিং চলে অথবা ব্যবহারকারী অ্যাডমিন না হয়, তাহলে একটি লোডিং মেসেজ দেখাও
  if (initializing || !userData || (userData.role !== 'admin' && userData.role !== 'superadmin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Loading Access...</p>
          <p className="text-sm text-gray-500">Verifying your credentials.</p>
        </div>
      </div>
    );
  }

  // যদি ব্যবহারকারী অ্যাডমিন হয়, তাহলেই শুধু পেজের কন্টেন্ট দেখাও
  return <>{children}</>;
};

export default ProtectedRoute;

