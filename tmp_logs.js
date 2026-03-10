import fs from 'fs';

const apiPath = 'src/features/logs/logsApi.ts';
let code = fs.readFileSync(apiPath, 'utf8');

const newLogs = `
    const today = new Date();
    const ts = (daysAgo) => {
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
`;

// Replace old initialLogs array
code = code.replace(/const initialLogs: UsageLog\[\] = \[[^\]]*\];/, newLogs.trim());

// Increment storage key
code = code.replace(/factorylog_usage_history/, 'factorylog_usage_history_v2');

fs.writeFileSync(apiPath, code);
console.log('Successfully updated logsApi.ts with new mock logs');
