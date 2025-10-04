'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { Users, Mail, CheckCircle2, XCircle, ArrowUp, ArrowDown, BarChart3, ArrowRight } from 'lucide-react';
// ★★★ FIX: Removed TooltipProps as we are defining a custom type now ★★★
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// ★★★ FIX: Removed unused 'NameType' import ★★★
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';


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
    requestDate?: { toDate: () => Date }; // Optional for data safety
    studentId: string;
    status: 'approved' | 'denied' | 'pending';
}

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
    trend: Trend;
    iconBgColor: string;
}

interface ChartData {
    name: string;
    members: number;
}


// --- REUSABLE UI COMPONENTS ---

const StatCard: React.FC<StatCardProps> = ({ title, total, icon, trend, iconBgColor }) => {
    const isTrendUp = trend.direction === 'up';
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#6D46C1]/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
            <div className="flex items-start justify-between">
                <div className="flex flex-col space-y-1.5">
                    <span className="text-slate-500 font-medium text-sm">{title}</span>
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

// ★★★ FIX: Created a specific interface for Tooltip props to resolve the type error ★★★
interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: ValueType }[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg">
                <p className="label text-slate-800 font-bold">{label}</p>
                <p className="intro text-[#6D46C1]">{`Members: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};


// --- SKELETON LOADER COMPONENTS ---
const StatCardSkeleton = () => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 animate-pulse">
        <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-2">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-8 bg-slate-300 rounded w-16"></div>
            </div>
            <div className="p-3 bg-slate-200 rounded-lg h-12 w-12"></div>
        </div>
        <div className="mt-4 h-4 bg-slate-200 rounded w-32"></div>
    </div>
);

const ChartSkeleton = () => (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="h-[400px] bg-slate-200 rounded-md"></div>
    </div>
);

const RecentApprovalsSkeleton = () => (
    <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const calculateTrend = (current: number, previous: number): Trend => {
    if (previous === 0) {
        return current > 0 ? { value: '+100%', direction: 'up' } : { value: '0%', direction: 'up' };
    }
    const percentageChange = ((current - previous) / previous) * 100;
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
    const [trendStats, setTrendStats] = useState<TrendStats>({ totalRequests: { value: '0%', direction: 'up' }, approved: { value: '0%', direction: 'up' }, denied: { value: '0%', direction: 'up' }, pending: { value: '0%', direction: 'up' }, });
    const [clubMemberChartData, setClubMemberChartData] = useState<ChartData[]>([]);
    const [recentMembers, setRecentMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => { setLoading(false); }, 500);
        const membershipsRef = collection(db, 'clubMemberships');

        const unsubscribeStats = onSnapshot(membershipsRef, (querySnapshot) => {
            const allMembers = querySnapshot.docs.map(doc => doc.data() as Member);
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            
            const currentMonthStats: ClubStats = { totalRequests: 0, approved: 0, denied: 0, pending: 0 };
            const previousMonthStats: ClubStats = { totalRequests: 0, approved: 0, denied: 0, pending: 0 };
            const totalStats: ClubStats = { totalRequests: 0, approved: 0, denied: 0, pending: 0 };
            const clubMemberCounts: { [key: string]: number } = {};

            allMembers.forEach(member => {
                if (member.requestDate) {
                    const requestDate = member.requestDate.toDate();
                    if(requestDate >= startOfCurrentMonth) {
                        currentMonthStats.totalRequests++;
                        if (member.status === 'approved') currentMonthStats.approved++; else if (member.status === 'denied') currentMonthStats.denied++; else if (member.status === 'pending') currentMonthStats.pending++;
                    } else if (requestDate >= startOfPreviousMonth && requestDate < startOfCurrentMonth) {
                        previousMonthStats.totalRequests++;
                        if (member.status === 'approved') previousMonthStats.approved++; else if (member.status === 'denied') previousMonthStats.denied++; else if (member.status === 'pending') previousMonthStats.pending++;
                    }
                }
                totalStats.totalRequests++;
                if (member.status === 'approved') {
                    totalStats.approved++;
                    if(member.clubName) { clubMemberCounts[member.clubName] = (clubMemberCounts[member.clubName] || 0) + 1; }
                } else if (member.status === 'denied') {
                    totalStats.denied++;
                } else if (member.status === 'pending') {
                    totalStats.pending++;
                }
            });
            setStats(totalStats);
            setTrendStats({
                totalRequests: calculateTrend(currentMonthStats.totalRequests, previousMonthStats.totalRequests),
                approved: calculateTrend(currentMonthStats.approved, previousMonthStats.approved),
                denied: calculateTrend(currentMonthStats.denied, previousMonthStats.denied),
                pending: calculateTrend(currentMonthStats.pending, previousMonthStats.pending),
            });
            const formattedClubData = Object.keys(clubMemberCounts).map(club => ({ name: club, members: clubMemberCounts[club] })).sort((a, b) => b.members - a.members).slice(0, 10);
            setClubMemberChartData(formattedClubData);
        });

        const recentMembersQuery = query(membershipsRef, where("status", "==", "approved"), orderBy("requestDate", "desc"), limit(5));
        const unsubscribeRecent = onSnapshot(recentMembersQuery, (snapshot) => {
            const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
            setRecentMembers(members);
        });

        return () => { clearTimeout(timer); unsubscribeStats(); unsubscribeRecent(); };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse mb-8">
                        <div className="h-8 bg-slate-300 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <ChartSkeleton />
                        <RecentApprovalsSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#4c0e4c]">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Here&apos;s a summary of your club&apos;s activities.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Requests" total={stats.totalRequests} icon={<Users size={22} className="text-[#6D46C1]" />} trend={trendStats.totalRequests} iconBgColor="bg-purple-100" />
                    <StatCard title="Pending Requests" total={stats.pending} icon={<Mail size={22} className="text-yellow-500" />} trend={trendStats.pending} iconBgColor="bg-yellow-100" />
                    <StatCard title="Approved Members" total={stats.approved} icon={<CheckCircle2 size={22} className="text-green-500" />} trend={trendStats.approved} iconBgColor="bg-green-100" />
                    <StatCard title="Denied Requests" total={stats.denied} icon={<XCircle size={22} className="text-red-500" />} trend={trendStats.denied} iconBgColor="bg-red-100" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-[#4c0e4c]">Club Membership Distribution</h2>
                            <BarChart3 size={22} className="text-slate-400" />
                        </div>
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart data={clubMemberChartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6D46C1" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#6D46C1" stopOpacity={0.2}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 200, 200, 0.4)" />
                                    <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(109, 70, 193, 0.1)' }} />
                                    <Bar dataKey="members" fill="url(#barGradient)" name="Approved Members" barSize={30} radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-[#4c0e4c]">Recent Approvals</h2>
                            <a href="#" className="flex items-center text-sm font-medium text-[#6D46C1] hover:underline">
                                View all <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                        <div className="space-y-2">
                            {recentMembers.map((member, index) => (
                                <div key={member.id} className={`flex items-center justify-between space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 ${index !== recentMembers.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                    <div className="flex items-center space-x-3 min-w-0">
                                        <div className="w-10 h-10 bg-gradient-to-tr from-[#6D46C1] to-[#8f6de0] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {member.studentName.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-slate-800 truncate">{member.studentName}</p>
                                            <p className="text-sm text-slate-500 truncate">{member.clubName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-medium text-slate-500">
                                            {member.requestDate?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) ?? 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;

