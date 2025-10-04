'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { Users, Mail, CheckCircle2, XCircle, ArrowUp, ArrowDown, BarChart3, Users2, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// --- TYPE DEFINITIONS ---
interface ClubStats {
  totalRequests: number;
  approved: number;
  denied: number;
  pending: number;
}

interface Member {
  id: string;
  studentName: string;
  clubName: string;
  requestDate: { toDate: () => Date };
  studentId: string;
  status: 'approved' | 'denied' | 'pending';
}

// ★★★ NEW: Added types for trend data for better type safety ★★★
interface Trend {
  value: string;
  direction: 'up' | 'down';
}

interface TrendStats {
  totalRequests: Trend;
  approved: Trend;
  denied: Trend;
  pending: Trend;
}

interface StatCardProps {
  title: string;
  total: string | number;
  icon: ReactNode;
  trend: Trend; // Updated to use the Trend type
  iconBgColor: string;
}

interface ChartData {
  name: string;
  members: number;
}


// --- REUSABLE UI COMPONENTS (No changes needed here) ---
const StatCard: React.FC<StatCardProps> = ({ title, total, icon, trend, iconBgColor }) => {
    // ... (This component remains the same as before)
    const isTrendUp = trend.direction === 'up';
    return (
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#6D46C1]/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
        <div className="flex items-start justify-between">
          <div className="flex flex-col space-y-1.5">
            <span className="text-slate-500 font-medium text-[14px]">{title}</span>
            <span className="text-3xl font-bold text-[#4c0e4c]">{total}</span>
          </div>
          <div className={`p-3 rounded-lg ${iconBgColor} transition-colors duration-300`}>
            {icon}
          </div>
        </div>
        <div className="flex items-center mt-4 text-xs">
          <span className={`flex items-center font-semibold ${isTrendUp ? 'text-green-500' : 'text-red-500'}`}>
            {isTrendUp ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            {trend.value}
          </span>
          <span className="text-slate-500 ml-2">vs last month</span>
        </div>
      </div>
    );
};

// ... (Other components like CustomTooltip and Skeletons remain the same)
// --- SKELETON LOADER COMPONENTS ---
const StatCardSkeleton = () => <div className="bg-white p-5 rounded-xl border border-slate-200 animate-pulse"><div className="flex items-start justify-between"><div className="flex flex-col space-y-2"><div className="h-4 bg-slate-200 rounded w-24"></div><div className="h-8 bg-slate-300 rounded w-16"></div></div><div className="p-3 bg-slate-200 rounded-lg h-12 w-12"></div></div><div className="mt-4 h-4 bg-slate-200 rounded w-32"></div></div>;
const ChartSkeleton = () => <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 animate-pulse"><div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div><div className="h-[400px] bg-slate-200 rounded-md"></div></div>;
const RecentApprovalsSkeleton = () => <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 animate-pulse"><div className="h-6 bg-slate-200 rounded w-1/2 mb-6"></div><div className="space-y-4">{[...Array(5)].map((_, i) => (<div key={i} className="flex items-center space-x-3"><div className="w-10 h-10 bg-slate-300 rounded-full"></div><div className="flex-1 space-y-2"><div className="h-4 bg-slate-300 rounded w-3/4"></div><div className="h-3 bg-slate-200 rounded w-1/2"></div></div></div>))}</div></div>;
const CustomTooltip = ({ active, payload, label }: any) => { if (active && payload && payload.length) { return (<div className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg"><p className="label text-slate-800 font-bold">{label}</p><p className="intro text-[#6D46C1]">{`Members: ${payload[0].value}`}</p></div>); } return null; };


// --- ★★★ NEW: Helper function to calculate percentage change ★★★ ---
const calculateTrend = (current: number, previous: number): Trend => {
    if (previous === 0) {
        // If previous month had 0 and current has more, it's a 100% increase (or simply "New")
        return current > 0 ? { value: '+100%', direction: 'up' } : { value: '0%', direction: 'up' };
    }
    
    const percentageChange = ((current - previous) / previous) * 100;

    // To prevent showing things like +0.00%
    if (Math.abs(percentageChange) < 0.1) {
      return { value: '0%', direction: 'up' };
    }

    const direction = percentageChange >= 0 ? 'up' : 'down';
    const value = `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`;
    
    return { value, direction };
};


// --- MAIN DASHBOARD COMPONENT ---
const DashboardPage = () => {
  const [stats, setStats] = useState<ClubStats>({ totalRequests: 0, approved: 0, denied: 0, pending: 0 });
  
  // ★★★ NEW: State to hold the calculated trend data ★★★
  const [trendStats, setTrendStats] = useState<TrendStats>({
    totalRequests: { value: '0%', direction: 'up' },
    approved: { value: '0%', direction: 'up' },
    denied: { value: '0%', direction: 'up' },
    pending: { value: '0%', direction: 'up' },
  });

  const [clubMemberChartData, setClubMemberChartData] = useState<ChartData[]>([]);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setLoading(false); }, 500);
    const membershipsRef = collection(db, 'clubMemberships');

    // ★★★ LOGIC UPDATE: This entire onSnapshot callback is updated ★★★
    const unsubscribeStats = onSnapshot(membershipsRef, (querySnapshot) => {
      
      const allMembers = querySnapshot.docs.map(doc => doc.data() as Member);

      // 1. Define time periods
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfPreviousMonth = new  Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // 2. Initialize stats for both months
      let currentMonthStats: ClubStats = { totalRequests: 0, approved: 0, denied: 0, pending: 0 };
      let previousMonthStats: ClubStats = { totalRequests: 0, approved: 0, denied: 0, pending: 0 };
      let totalStats: ClubStats = { totalRequests: 0, approved: 0, denied: 0, pending: 0 };
      const clubMemberCounts: { [key: string]: number } = {};

      // 3. Process each document and assign to the correct time period
      allMembers.forEach(member => {
        const requestDate = member.requestDate.toDate();
        let statsToUpdate: ClubStats | null = null;
        
        if(requestDate >= startOfCurrentMonth) {
            statsToUpdate = currentMonthStats;
        } else if (requestDate >= startOfPreviousMonth && requestDate <= endOfPreviousMonth) {
            statsToUpdate = previousMonthStats;
        }

        if (statsToUpdate) {
            statsToUpdate.totalRequests++;
            if (member.status === 'approved') statsToUpdate.approved++;
            else if (member.status === 'denied') statsToUpdate.denied++;
            else if (member.status === 'pending') statsToUpdate.pending++;
        }
        
        // Calculate total stats for all time (for display)
        totalStats.totalRequests++;
        if (member.status === 'approved') {
            totalStats.approved++;
            if(member.clubName) {
                clubMemberCounts[member.clubName] = (clubMemberCounts[member.clubName] || 0) + 1;
            }
        } else if (member.status === 'denied') {
            totalStats.denied++;
        } else if (member.status === 'pending') {
            totalStats.pending++;
        }
      });

      // 4. Set total stats for display
      setStats(totalStats);

      // 5. Calculate trends and set them in state
      setTrendStats({
        totalRequests: calculateTrend(currentMonthStats.totalRequests, previousMonthStats.totalRequests),
        approved: calculateTrend(currentMonthStats.approved, previousMonthStats.approved),
        denied: calculateTrend(currentMonthStats.denied, previousMonthStats.denied),
        pending: calculateTrend(currentMonthStats.pending, previousMonthStats.pending),
      });

      // Update chart data (no change here)
      const formattedClubData = Object.keys(clubMemberCounts).map(club => ({ name: club, members: clubMemberCounts[club] })).sort((a, b) => b.members - a.members).slice(0, 10);
      setClubMemberChartData(formattedClubData);
    });

    const recentMembersQuery = query(membershipsRef, where("status", "==", "approved"), orderBy("requestDate", "desc"), limit(5));
    const unsubscribeRecent = onSnapshot(recentMembersQuery, (snapshot) => {
      const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
      setRecentMembers(members);
    });

    return () => {
      clearTimeout(timer);
      unsubscribeStats();
      unsubscribeRecent();
    };
  }, []);

  // ... (Loading state JSX remains the same)
  if (loading) { return ( <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"> <div className="max-w-7xl mx-auto"> <div className="animate-pulse mb-8"> <div className="h-8 bg-slate-300 rounded w-1/4 mb-2"></div> <div className="h-4 bg-slate-200 rounded w-1/3"></div> </div> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8"> <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /> </div> <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> <ChartSkeleton /><RecentApprovalsSkeleton /> </div> </div> </div> ); }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
      
        {/* ★★★ JSX UPDATE: The 'trend' prop is now dynamic using the new state ★★★ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard title="Total Requests" total={stats.totalRequests} icon={<Users size={22} className="text-[#6D46C1]" />} trend={trendStats.totalRequests} iconBgColor="bg-purple-100" />
          <StatCard title="Pending Requests" total={stats.pending} icon={<Mail size={22} className="text-yellow-500" />} trend={trendStats.pending} iconBgColor="bg-yellow-100" />
          <StatCard title="Approved Members" total={stats.approved} icon={<CheckCircle2 size={22} className="text-green-500" />} trend={trendStats.approved} iconBgColor="bg-green-100" />
          <StatCard title="Denied Requests" total={stats.denied} icon={<XCircle size={22} className="text-red-500" />} trend={trendStats.denied} iconBgColor="bg-red-100" />
        </div>

        {/* ... (Rest of the JSX remains the same) ... */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold text-[#4c0e4c]">Club Membership Distribution</h2><BarChart3 size={22} className="text-slate-400" /></div>
            <div style={{ width: '100%', height: 400 }}><ResponsiveContainer><BarChart data={clubMemberChartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}><defs><linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6D46C1" stopOpacity={0.8}/><stop offset="95%" stopColor="#6D46C1" stopOpacity={0.2}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 200, 200, 0.4)" /><XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(109, 70, 193, 0.1)' }} /><Bar dataKey="members" fill="url(#barGradient)" name="Approved Members" barSize={30} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </div>
          <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold text-[#4c0e4c]">Recent Approvals</h2><a href="#" className="flex items-center text-sm font-medium text-[#6D46C1] hover:underline">View all <ArrowRight className="w-4 h-4 ml-1" /></a></div>
             <div className="space-y-2">{recentMembers.map((member, index) => ( <div key={member.id} className={`flex items-center justify-between space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 ${index !== recentMembers.length - 1 ? 'border-b border-slate-100' : ''}`}><div className="flex items-center space-x-3 min-w-0"><div className="w-10 h-10 bg-gradient-to-tr from-[#6D46C1] to-[#8f6de0] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">{member.studentName.charAt(0)}</div><div className="min-w-0 flex-1"><p className="font-semibold text-slate-800 truncate">{member.studentName}</p><p className="text-sm text-slate-500 truncate">{member.clubName}</p></div></div><div className="text-right flex-shrink-0"><p className="text-sm font-medium text-slate-500">{member.requestDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div></div> ))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;