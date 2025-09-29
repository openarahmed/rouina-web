// File: app/dashboard/page.tsx
'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { db } from '../lib/firebaseConfig';
import { collection, onSnapshot, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Users, Mail, CheckCircle2, XCircle } from 'lucide-react';
import ChartOne from '../components/dashboard/ChartOne';
import RecentMembersTable from '../components/dashboard/RecentMembersTable';

// ... (interface এবং StatCard কম্পোনেন্ট অপরিবর্তিত)
interface ClubStats { totalRequests: number; approved: number; denied: number; pending: number; }
interface Member { id: string; studentName: string; clubName: string; }
interface StatCardProps { title: string; total: string | number; icon: ReactNode; }
const StatCard: React.FC<StatCardProps> = ({ title, total, icon }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white py-6 px-7 shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 mb-4">{icon}</div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold text-black">{total}</h4>
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </div>
      </div>
    </div>
  );
};


const DashboardPage = () => {
  const [stats, setStats] = useState<ClubStats>({ totalRequests: 0, approved: 0, denied: 0, pending: 0 });
  // ★★★ পরিবর্তন: ChartData এর state এর নাম পরিবর্তন করে আরও স্পষ্ট করা হলো ★★★
  const [clubMemberChartData, setClubMemberChartData] = useState<any[]>([]);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const membershipsRef = collection(db, 'clubMemberships');
    const unsubscribeStats = onSnapshot(membershipsRef, (querySnapshot) => {
      let approvedCount = 0, deniedCount = 0, pendingCount = 0;
      // ★★★ নতুন: প্রতিটি ক্লাবের সদস্য গণনার জন্য অবজেক্ট ★★★
      const clubMemberCounts: { [key: string]: number } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'approved') {
          approvedCount++;
          // ★★★ নতুন: যদি স্ট্যাটাস approved হয়, তাহলে ক্লাবের সদস্য সংখ্যা বাড়ানো হচ্ছে ★★★
          const clubName = data.clubName;
          if (clubName) {
            clubMemberCounts[clubName] = (clubMemberCounts[clubName] || 0) + 1;
          }
        } else if (data.status === 'denied') {
          deniedCount++;
        } else if (data.status === 'pending') {
          pendingCount++;
        }
      });

      setStats({
        totalRequests: querySnapshot.size, approved: approvedCount, denied: deniedCount, pending: pendingCount,
      });
      
      // ★★★ নতুন: চার্টের জন্য ডেটা ফরম্যাট করা হচ্ছে ★★★
      const formattedClubData = Object.keys(clubMemberCounts).map(club => ({
          name: club, // X-axis এ ক্লাবের নাম
          members: clubMemberCounts[club] // Y-axis এ সদস্য সংখ্যা
      }));
      setClubMemberChartData(formattedClubData);
      
      setLoading(false);
    });

    const q = query(membershipsRef, where("status", "==", "approved"), orderBy("requestDate", "desc"), limit(5));
    const unsubscribeRecent = onSnapshot(q, (querySnapshot) => {
        const members: Member[] = [];
        querySnapshot.forEach((doc) => { members.push({ id: doc.id, ...doc.data() } as Member); });
        setRecentMembers(members);
    });

    return () => { unsubscribeStats(); unsubscribeRecent(); };
  }, []);

  if (loading) { return ( "loading...") }

  return (
    <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Requests" total={stats.totalRequests} icon={<Users size={22} className="text-purple-600" />} />
            <StatCard title="Pending Requests" total={stats.pending} icon={<Mail size={22} className="text-yellow-600" />} />
            <StatCard title="Approved Members" total={stats.approved} icon={<CheckCircle2 size={22} className="text-green-600" />} />
            <StatCard title="Denied Requests" total={stats.denied} icon={<XCircle size={22} className="text-red-600" />} />
        </div>
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                {/* ★★★ পরিবর্তন: চার্টে নতুন ডেটা পাস করা হচ্ছে ★★★ */}
                <ChartOne data={clubMemberChartData} />
            </div>
            <div className="col-span-12">
                 <RecentMembersTable members={recentMembers} />
            </div>
        </div>
    </div>
  );
};

export default DashboardPage;