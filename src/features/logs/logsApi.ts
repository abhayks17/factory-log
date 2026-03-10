import { getTools, updateTool } from "../tools/toolsApi";

export interface UsageLog {
    id: string;
    toolId: string;
    toolName: string;
    workerName: string;
    department: string;
    quantity: number;
    scannedAt: string;
}


const STORAGE_KEY = "factorylog_usage_history_v2";

export function getUsageLogs(): UsageLog[] {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);

    // Initial mock history
    const today = new Date();
    const ts = (daysAgo: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() - daysAgo);
        return d.toISOString();
    };

    const initialLogs: UsageLog[] = [
        { id: "1", toolId: "A1", toolName: "Water Miscible-MOLVER", workerName: "Marcus Johnson", department: "Glass Line", quantity: 5, scannedAt: ts(0) },
        { id: "2", toolId: "A36", toolName: "6MM CLEAR FLOAT", workerName: "Sarah Chen", department: "Glass Line", quantity: 10, scannedAt: ts(0) },
        { id: "3", toolId: "A4", toolName: "THIOVER CATALYST - Black Pail", workerName: "David Rodriguez", department: "Glass Line", quantity: 2, scannedAt: ts(1) },
        { id: "4", toolId: "A9", toolName: "11.5 Spacer", workerName: "Emma Wilson", department: "Glass Line", quantity: 15, scannedAt: ts(1) },
        { id: "5", toolId: "A15", toolName: "11.5 Connector", workerName: "Marcus Johnson", department: "Glass Line", quantity: 30, scannedAt: ts(2) },
        { id: "6", toolId: "A57", toolName: "BLACK Ceramic- SX2439E808", workerName: "Sarah Chen", department: "Glass Line", quantity: 3, scannedAt: ts(2) },
        { id: "7", toolId: "A102", toolName: '6MM CLEAR: 96x130"', workerName: "Emma Wilson", department: "Glass Line", quantity: 8, scannedAt: ts(3) },
        { id: "8", toolId: "A38", toolName: "6MM KNT155", workerName: "David Rodriguez", department: "Glass Line", quantity: 12, scannedAt: ts(4) },
        { id: "9", toolId: "A91", toolName: "Graphite - RC1-0604", workerName: "Marcus Johnson", department: "Glass Line", quantity: 4, scannedAt: ts(5) },
        { id: "10", toolId: "A11", toolName: "14.5 Spacer", workerName: "Sarah Chen", department: "Glass Line", quantity: 25, scannedAt: ts(6) },
    ];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initialLogs));
    return initialLogs;
}

export async function addUsageLog(toolId: string, quantity: number = 1): Promise<UsageLog> {
    const logs = getUsageLogs();
    const tools = await getTools();
    const tool = tools.find(t => t.toolId === toolId) || tools.find(t => t.id === toolId);

    if (tool) {
        // Decrement stock
        const newStockLevel = Math.max(0, tool.stockLevel - quantity);
        await updateTool(tool.id, { stockLevel: newStockLevel });
    }

    const newLog: UsageLog = {
        id: Date.now().toString(),
        toolId: tool?.toolId || toolId,
        toolName: tool?.name || `Unknown Tool (${toolId})`,
        workerName: "Current Operator", // In a real app, get from auth store
        department: tool?.department || "General",
        quantity,
        scannedAt: new Date().toISOString(),
    };

    const updated = [newLog, ...logs];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newLog;
}
