import { useNavigate } from "react-router";
import { CheckCircle, QrCode } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { formatDate } from "@/lib/utils";
import type { ScanResult } from "./scannerApi";

export function SuccessPage() {
    const navigate = useNavigate();
    const raw = sessionStorage.getItem("lastScan");
    const scan: ScanResult | null = raw ? JSON.parse(raw) : null;

    if (!scan) {
        navigate("/scan", { replace: true });
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <Navbar title="Scan Complete" />

            <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full gap-6">
                {/* Success card */}
                <div className="bg-white w-full rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    {/* Green header */}
                    <div className="bg-green-50 p-8 flex flex-col items-center border-b border-gray-100">
                        <div className="bg-green-500 rounded-full p-4 mb-4 shadow-lg">
                            <CheckCircle className="w-20 h-20 text-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-green-700 text-center">
                            Recorded Successfully
                        </h2>
                    </div>

                    {/* Details */}
                    <div className="p-8 space-y-5">
                        <DetailRow label="Tool" value={scan.toolName} large />
                        <hr className="border-gray-100" />
                        <div className="grid grid-cols-2 gap-5">
                            <DetailRow label="Quantity Taken" value={scan.quantity?.toString() || "1"} large />
                            <DetailRow label="Worker" value={scan.workerName} />
                        </div>
                        <hr className="border-gray-100" />
                        <div className="grid grid-cols-2 gap-5">
                            <DetailRow label="Department" value={scan.department} />
                            <DetailRow label="Time" value={formatDate(scan.scannedAt)} />
                        </div>
                    </div>
                </div>

                {/* Scan another CTA — big button for gloved hands */}
                <button
                    onClick={() => navigate("/scan")}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white text-2xl font-extrabold py-7 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95"
                >
                    <QrCode className="w-8 h-8" />
                    SCAN ANOTHER
                </button>
            </main>
        </div>
    );
}

function DetailRow({ label, value, large }: { label: string; value: string; large?: boolean }) {
    return (
        <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`font-extrabold text-gray-900 ${large ? "text-2xl" : "text-lg"}`}>{value}</p>
        </div>
    );
}
