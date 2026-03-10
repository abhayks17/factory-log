import { getUsageLogs } from "../logs/logsApi";
import { getTools } from "../tools/toolsApi";

export interface DashboardStats {
    totalScansToday: number;
    mostUsedTool: string;
    outOfStockItems: number;
    weeklyData: { name: string; scans: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const logs = getUsageLogs();
    const tools = await getTools();

    const todayStr = new Date().toISOString().split('T')[0];

    // Total scans today
    const totalScansToday = logs
        .filter(log => log.scannedAt.startsWith(todayStr))
        .reduce((sum, log) => sum + (log.quantity || 1), 0);

    // Most used tool
    const toolUsage: Record<string, number> = {};
    let mostUsedTool = "None";
    let maxScans = 0;

    logs.forEach(log => {
        toolUsage[log.toolName] = (toolUsage[log.toolName] || 0) + (log.quantity || 1);
        if (toolUsage[log.toolName] > maxScans) {
            maxScans = toolUsage[log.toolName];
            mostUsedTool = log.toolName;
        }
    });

    // Out of stock
    const outOfStockItems = tools.filter(t => t.stockLevel === 0).length;

    // Weekly Data
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = days.map(name => ({ name, scans: 0 }));

    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 6); // Past 7 days including today
    oneWeekAgo.setHours(0, 0, 0, 0);

    logs.forEach(log => {
        const d = new Date(log.scannedAt);
        if (d >= oneWeekAgo) {
            weeklyData[d.getDay()].scans += (log.quantity || 1);
        }
    });

    // Reorder array so today is visually last or just standard Mon-Sun
    // Standard Mon-Sun for the chart
    const orderedWeeklyData = [
        weeklyData[1], // Mon
        weeklyData[2], // Tue
        weeklyData[3], // Wed
        weeklyData[4], // Thu
        weeklyData[5], // Fri
        weeklyData[6], // Sat
        weeklyData[0], // Sun
    ];

    return {
        totalScansToday,
        mostUsedTool,
        outOfStockItems,
        weeklyData: orderedWeeklyData
    };
}
