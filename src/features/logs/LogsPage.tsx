import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Clock, Calendar, User, Package } from "lucide-react";
import { getUsageLogs } from "./logsApi";

export function LogsPage() {
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");

    const { data: logs = [], isLoading } = useQuery({
        queryKey: ["usage-logs"],
        queryFn: getUsageLogs,
    });

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.toolName.toLowerCase().includes(search.toLowerCase()) ||
            log.workerName.toLowerCase().includes(search.toLowerCase()) ||
            log.toolId.toLowerCase().includes(search.toLowerCase());

        const matchesDept = deptFilter === "All" || log.department === deptFilter;

        return matchesSearch && matchesDept;
    });

    const departments = ["All", ...new Set(logs.map(l => l.department))];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Usage Logs</h1>
                    <p className="text-gray-500 mt-1 font-medium">Real-time history of tool and part scans</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tool, worker or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-900 outline-none font-medium transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-gray-400 hidden sm:block" />
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-900 outline-none font-bold bg-white min-w-[160px]"
                    >
                        {departments.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-xs font-black uppercase tracking-widest">
                                <th className="px-6 py-5">Time & Date</th>
                                <th className="px-6 py-5">Worker</th>
                                <th className="px-6 py-5">Tool / Part</th>
                                <th className="px-6 py-5">Quantity</th>
                                <th className="px-6 py-5">Department</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-900 rounded-full animate-spin" />
                                            <p className="text-gray-500 font-bold">Loading records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-gray-500 font-bold">
                                        No matching logs found
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                                    <Clock className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-sm">
                                                        {new Date(log.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                                        {new Date(log.scannedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-900" />
                                                <span className="font-bold text-sm text-gray-800">{log.workerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2">
                                                <Package className="w-4 h-4 text-orange-600 mt-1" />
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 leading-tight">{log.toolName}</p>
                                                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mt-0.5">{log.toolId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-black text-xl text-gray-900">{log.quantity || 1}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                {log.department}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
