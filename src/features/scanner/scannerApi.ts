import { api } from "@/lib/api";
import { addUsageLog } from "../logs/logsApi";

export interface ScanPayload {
    toolId: string;
    quantity: number;
}

export interface ScanResult {
    id: string;
    toolName: string;
    workerName: string;
    department: string;
    quantity: number;
    scannedAt: string;
}

export async function recordScan(payload: ScanPayload): Promise<ScanResult> {
    try {
        // Try real API first
        const { data } = await api.post<ScanResult>("/api/scan", payload);
        return data;
    } catch {
        // Mock fallback using our shared history storage
        return await addUsageLog(payload.toolId, payload.quantity);
    }
}
