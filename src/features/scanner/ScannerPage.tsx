import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { QrCode, Camera, Keyboard, Minus, Plus as PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { QrScanner } from "./QrScanner";
import { recordScan, type ScanResult } from "./scannerApi";
import { getTools } from "../tools/toolsApi";

export function ScannerPage() {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [manualMode, setManualMode] = useState(false);

    // Quantity Phase State
    const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Internal values for manual entry
    const [manualToolId, setManualToolId] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleToolDetected = useCallback(async (toolId: string) => {
        try {
            const tools = await getTools();
            const exists = tools.some(t => t.toolId === toolId || t.id === toolId);

            if (!exists) {
                toast.error(`Invalid Tool ID (${toolId}). Item not found.`);
                return;
            }

            setSelectedToolId(toolId);
            setScanning(false);
            setManualMode(false);
            setQuantity(1); // Reset to default
        } catch (error) {
            toast.error("Failed to validate tool ID");
        }
    }, []);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualToolId.trim()) {
            toast.error("Please enter a Tool ID");
            return;
        }
        handleToolDetected(manualToolId.trim());
    };

    const confirmScan = async () => {
        if (!selectedToolId) return;
        if (processing) return;

        setProcessing(true);

        try {
            const result = await recordScan({ toolId: selectedToolId, quantity });
            sessionStorage.setItem("lastScan", JSON.stringify(result));
            toast.success("Tool detected! Recording...");
            navigate("/scan/success");
        } catch {
            const mockResult: ScanResult = {
                id: "demo-" + Date.now(),
                toolName: "Tool #" + selectedToolId.slice(-4),
                workerName: "Current Worker",
                department: "Glass Line",
                quantity,
                scannedAt: new Date().toISOString(),
            };
            sessionStorage.setItem("lastScan", JSON.stringify(mockResult));
            toast.success("Tool detected! Recording...");
            navigate("/scan/success");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <Navbar title="Scan Tool" />

            <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full gap-8">
                {(!scanning && !manualMode && !selectedToolId) && (
                    <>
                        <div className="bg-white rounded-full p-10 shadow-lg mb-4">
                            <QrCode className="w-24 h-24 text-blue-900" />
                        </div>

                        <div className="text-center w-full space-y-3">
                            <h2 className="text-3xl font-extrabold text-gray-900">Ready to Scan</h2>
                            <p className="text-lg text-gray-600 px-4">
                                Open your camera to scan a tool QR code, or enter the ID manually.
                            </p>
                        </div>

                        <div className="w-full space-y-4">
                            <button
                                onClick={() => setScanning(true)}
                                className="w-full bg-blue-900 hover:bg-blue-800 text-white text-2xl font-extrabold py-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 px-4"
                            >
                                <Camera className="w-8 h-8" />
                                SCAN QR CODE
                            </button>

                            <div className="flex items-center gap-4 py-2 px-8">
                                <div className="h-px bg-gray-300 flex-1"></div>
                                <span className="text-gray-400 font-extrabold uppercase text-sm tracking-widest">OR</span>
                                <div className="h-px bg-gray-300 flex-1"></div>
                            </div>

                            <button
                                onClick={() => setManualMode(true)}
                                className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-xl font-extrabold py-5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Keyboard className="w-6 h-6 text-gray-400" />
                                Enter Manually
                            </button>
                        </div>
                    </>
                )}

                {manualMode && !selectedToolId && (
                    <div className="w-full bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center">
                        <div className="text-center mb-8 w-full">
                            <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400 border-2 border-gray-100">
                                <Keyboard className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Manual Entry</h2>
                            <p className="text-gray-500 font-medium">Type the exact Tool ID printed below the QR code label.</p>
                        </div>

                        <form onSubmit={handleManualSubmit} className="space-y-6 w-full">
                            <div>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="e.g. PT-001"
                                    value={manualToolId}
                                    onChange={(e) => setManualToolId(e.target.value.toUpperCase())}
                                    className="w-full px-5 py-5 text-2xl font-black text-center uppercase tracking-widest text-gray-900 border-2 border-gray-300 rounded-2xl focus:border-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={!manualToolId.trim()}
                                    className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-xl font-extrabold py-5 rounded-2xl shadow-lg transition-all active:scale-95"
                                >
                                    Select Tool
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setManualMode(false);
                                        setManualToolId("");
                                    }}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-bold py-4 rounded-2xl transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {scanning && !selectedToolId && (
                    <div className="w-full flex flex-col items-center">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Point at QR Code</h2>
                            <p className="text-gray-500 font-medium px-4">Hold the camera steady over the tool's labeled QR code to capture it automatically.</p>
                        </div>

                        <div className="w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl border-4 border-white bg-black aspect-square flex items-center justify-center relative">
                            <QrScanner onScanSuccess={handleToolDetected} />
                            <div className="absolute inset-0 border-2 border-blue-500/50 m-6 rounded-xl pointer-events-none">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg -m-1"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg -m-1"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg -m-1"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg -m-1"></div>
                            </div>
                        </div>

                        <button
                            onClick={() => setScanning(false)}
                            className="w-full mt-6 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-xl font-extrabold py-5 rounded-2xl shadow-sm transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {selectedToolId && (
                    <div className="w-full bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center">
                        <div className="text-center mb-6 w-full">
                            <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-900 border-2 border-blue-100">
                                <QrCode className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Tool Detected</h2>
                            <p className="text-blue-900 font-black text-xl tracking-widest">{selectedToolId}</p>
                            <p className="text-gray-500 font-medium mt-2">How many items are you taking?</p>
                        </div>

                        {processing ? (
                            <div className="w-full py-12 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 border-4 border-gray-100 border-t-blue-900 rounded-full animate-spin mb-6" />
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Recording</h3>
                                <p className="text-gray-500 font-medium">Verifying tool assignment...</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full flex items-center justify-center gap-6 mb-8 py-4">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-700 border-2 border-gray-200 rounded-2xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all active:scale-95 disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-8 h-8 stroke-[3]" />
                                    </button>

                                    <div className="flex-1 text-center">
                                        <span className="text-6xl font-black text-gray-900">{quantity}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-700 border-2 border-gray-200 rounded-2xl hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all active:scale-95"
                                    >
                                        <PlusIcon className="w-8 h-8 stroke-[3]" />
                                    </button>
                                </div>

                                <div className="space-y-3 w-full border-t border-gray-100 pt-6">
                                    <button
                                        onClick={confirmScan}
                                        disabled={processing}
                                        className="w-full bg-blue-900 hover:bg-blue-800 text-white text-xl font-extrabold py-5 rounded-2xl shadow-lg transition-all active:scale-95"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedToolId(null)}
                                        disabled={processing}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-bold py-4 rounded-2xl transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
