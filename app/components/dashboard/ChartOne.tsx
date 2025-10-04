// File: app/components/dashboard/ChartOne.tsx
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreHorizontal } from 'lucide-react';

// 1. 'any' type এর পরিবর্তে নির্দিষ্ট data type define করা হয়েছে
interface ChartData {
    name: string;
    members: number;
}

interface ChartOneProps {
    data: ChartData[]; 
}

// 2. RoundedBar component এর props এর জন্য নির্দিষ্ট type define করা হয়েছে
interface RoundedBarProps {
    fill?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

const RoundedBar = (props: RoundedBarProps) => {
    const { fill, x = 0, y = 0, width = 0, height = 0 } = props;
    const radius = 6;

    const path = `M${x},${y + height} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + width - radius},${y} Q${x + width},${y} ${x + width},${y + radius} L${x + width},${y + height} Z`;

    return <path d={path} fill={fill} />;
};


const ChartOne: React.FC<ChartOneProps> = ({ data }) => {
    return (
        <div className="col-span-12 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex mb-4 justify-between items-center gap-4">
                <div>
                    {/* ★★★ পরিবর্তন: চার্টের শিরোনাম পরিবর্তন করা হয়েছে ★★★ */}
                    <h4 className="text-xl font-semibold text-black">
                        Members Per Club
                    </h4>
                </div>
                <button className="p-1 rounded-full hover:bg-gray-100">
                    <MoreHorizontal size={20} className="text-gray-500" />
                </button>
            </div>

            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            // ★★★ যদি ক্লাবের নাম বড় হয়, তাহলে কোণাকুণি দেখানোর জন্য ★★★
                            interval={0}
                            angle={-30}
                            textAnchor="end"
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <Tooltip 
                            cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
                            contentStyle={{ 
                                backgroundColor: '#ffffff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        {/* ★★★ পরিবর্তন: dataKey এবং name পরিবর্তন করা হয়েছে ★★★ */}
                        <Bar 
                            dataKey="members" 
                            fill="#4F46E5" // Indigo color
                            name="Total Members" 
                            shape={<RoundedBar />} 
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ChartOne;
