"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OrderData {
    total_amount: number;
    created_at: string;
}

interface AnalyticsProps {
    data: OrderData[];
}

export default function AdminAnalytics({ data }: AnalyticsProps) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const grouped = data.reduce((acc, order) => {
            const dateObj = new Date(order.created_at);
            const dateStr = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
            if (!acc[dateStr]) {
                acc[dateStr] = 0;
            }
            acc[dateStr] += order.total_amount || 0;
            return acc;
        }, {} as Record<string, number>);

        // Sort by date (assuming all within a recent timeframe like same year, or just sort keys. Better to sort by actual date)
        const sortedDates = Object.keys(grouped).sort((a, b) => {
            const [dayA, monthA] = a.split('/');
            const [dayB, monthB] = b.split('/');
            if (monthA !== monthB) return parseInt(monthA) - parseInt(monthB);
            return parseInt(dayA) - parseInt(dayB);
        });

        return sortedDates.map(date => ({
            date,
            revenue: grouped[date]
        }));
    }, [data]);

    if (chartData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-stone-400 border border-dashed border-stone-200">
                Not enough data to display analytics.
            </div>
        );
    }

    return (
        <div className="h-72 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#78716c' }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#78716c' }}
                        tickFormatter={(value) => `₹${value}`}
                        dx={-10}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
