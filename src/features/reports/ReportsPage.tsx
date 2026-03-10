import { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { downloadReport } from "./reportsApi";

export function ReportsPage() {
    const [type, setType] = useState<"usage_log" | "daily_item" | "weekly_item" | "monthly_item">("weekly_item");

    // Default to last 7 days for weekly report
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [startDate, setStartDate] = useState(lastWeek.toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);

    const handleTypeChange = (newType: string) => {
        setType(newType as any);
        const now = new Date();
        const end = now.toISOString().split("T")[0];
        setEndDate(end);

        if (newType === "daily_item") {
            setStartDate(end);
        } else if (newType === "weekly_item") {
            const start = new Date(now);
            start.setDate(now.getDate() - 7);
            setStartDate(start.toISOString().split("T")[0]);
        } else if (newType === "monthly_item") {
            const start = new Date(now);
            start.setMonth(now.getMonth() - 1);
            setStartDate(start.toISOString().split("T")[0]);
        }
    };

    const handleDownload = async () => {
        setLoading(true);
        try {
            const blob = await downloadReport({ type, startDate, endDate });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `factorylog-report-${type}-${startDate}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Report downloaded successfully!");
        } catch {
            toast.error("Backend not connected. Report download unavailable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Reports</h1>
                <p className="text-gray-500 mt-1 font-medium">Download usage data as Excel spreadsheets</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-8">
                    <FileSpreadsheet className="w-7 h-7 text-green-600" />
                    <h2 className="text-xl font-extrabold text-gray-900">Generate Report</h2>
                </div>

                <div className="max-w-md space-y-6">
                    {/* Report type */}
                    <div>
                        <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
                            Report Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => handleTypeChange(e.target.value as any)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none font-semibold bg-white transition-all"
                        >
                            <option value="usage_log">Raw Usage Log</option>
                            <option value="daily_item">Daily Item Report</option>
                            <option value="weekly_item">Weekly Item Report</option>
                            <option value="monthly_item">Monthly Item Report</option>
                        </select>
                    </div>

                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none font-semibold text-gray-700 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-900 transition-all outline-none font-semibold text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Download button */}
                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={handleDownload}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-extrabold transition-all shadow-md active:scale-95 text-xl"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Download className="w-6 h-6" />
                                    Download Excel Report
                                </>
                            )}
                        </button>
                        <p className="text-center text-sm text-gray-400 mt-3 font-medium">
                            Includes all scan events within the selected date range
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
