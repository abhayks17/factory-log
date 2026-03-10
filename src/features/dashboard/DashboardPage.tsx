import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Package, AlertTriangle, TrendingUp } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from "recharts";
import { getDashboardStats } from "./dashboardApi";

// --- Mock fallback data (used when backend is offline) ---
const MOCK_STATS = {
    totalScansToday: 215,
    mostUsedTool: "M8 Titanium Bolt",
    outOfStockItems: 3,
    weeklyData: [
        { name: "Mon", scans: 145 },
        { name: "Tue", scans: 182 },
        { name: "Wed", scans: 164 },
        { name: "Thu", scans: 198 },
        { name: "Fri", scans: 215 },
        { name: "Sat", scans: 85 },
        { name: "Sun", scans: 42 },
    ],
};

export function DashboardPage() {
    const { data: stats = MOCK_STATS } = useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboardStats,
        retry: false,
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1 font-medium">Today's factory activity overview</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    icon={<ClipboardList className="w-8 h-8" />}
                    iconBg="bg-blue-100 text-blue-900"
                    label="Total Scans Today"
                    value={stats.totalScansToday}
                    sub="+12% from yesterday"
                    subColor="text-green-600"
                />
                <StatCard
                    icon={<Package className="w-8 h-8" />}
                    iconBg="bg-orange-100 text-orange-600"
                    label="Most Used Tool"
                    value={stats.mostUsedTool}
                    sub="42 scans today"
                    subColor="text-gray-500"
                    valueSmall
                />
                <StatCard
                    icon={<AlertTriangle className="w-8 h-8" />}
                    iconBg="bg-red-100 text-red-700"
                    label="Items to Restock"
                    value={stats.outOfStockItems}
                    sub="Items currently out of stock"
                    subColor="text-red-500"
                />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-6 h-6 text-blue-900" />
                    <h3 className="text-xl font-extrabold text-gray-900">Weekly Scan Activity</h3>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontWeight: 700 }} dy={8} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontWeight: 700 }} />
                            <Tooltip
                                cursor={{ fill: "#f9fafb" }}
                                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontWeight: 700 }}
                            />
                            <Bar dataKey="scans" fill="#1e3a8a" radius={[6, 6, 0, 0]} barSize={42} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: number | string;
    sub: string;
    subColor: string;
    valueSmall?: boolean;
}

function StatCard({ icon, iconBg, label, value, sub, subColor, valueSmall }: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-start gap-4">
            <div className={`p-4 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
            <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className={`font-black text-gray-900 mt-1 leading-tight ${valueSmall ? "text-xl" : "text-4xl"}`}>
                    {value}
                </p>
                <p className={`text-sm font-bold mt-1 ${subColor}`}>{sub}</p>
            </div>
        </div>
    );
}
