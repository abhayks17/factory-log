import * as xlsx from "xlsx-js-style";
import { getUsageLogs } from "../logs/logsApi";
import { getTools } from "../tools/toolsApi";

export interface ReportPayload {
    type: "usage_log" | "daily_item" | "weekly_item" | "monthly_item";
    startDate: string;
    endDate: string;
}

export async function downloadReport({ type, startDate, endDate }: ReportPayload): Promise<Blob> {
    const logs = getUsageLogs();
    const tools = await getTools();

    // Filter logs by date range
    const filteredLogs = logs.filter(log => {
        const date = log.scannedAt.split("T")[0];
        return date >= startDate && date <= endDate;
    });

    let data: any[] = [];

    if (type === "usage_log") {
        data = filteredLogs.map(log => ({
            "Date": new Date(log.scannedAt).toLocaleDateString(),
            "Time": new Date(log.scannedAt).toLocaleTimeString(),
            "Tool Name": log.toolName,
            "Tool ID": log.toolId,
            "Quantity": log.quantity || 1,
            "Worker": log.workerName,
            "Department": log.department
        }));
    } else if (type === "daily_item" || type === "weekly_item" || type === "monthly_item") {
        const itemStats: Record<string, any> = {};

        // Initialize all tools, including those with 0 usage
        tools.forEach(tool => {
            itemStats[tool.toolId] = {
                "Tag ID": tool.toolId,
                "Items Description": tool.name,
                "UoM": tool.uom || "units",
                usageByTime: {} as Record<string, number>,
                Total: 0
            };
        });

        // Add any missing ones found in logs (in case tool was deleted)
        filteredLogs.forEach(log => {
            if (!itemStats[log.toolId]) {
                itemStats[log.toolId] = {
                    "Tag ID": log.toolId,
                    "Items Description": log.toolName,
                    "UoM": "units",
                    usageByTime: {} as Record<string, number>,
                    Total: 0
                };
            }

            const dateObj = new Date(log.scannedAt);
            let timeKey = "";

            if (type === "daily_item") {
                timeKey = "Qty Used";
            } else if (type === "weekly_item") {
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                timeKey = days[dateObj.getDay()];
            } else if (type === "monthly_item") {
                timeKey = dateObj.getDate().toString();
            }

            itemStats[log.toolId].usageByTime[timeKey] = (itemStats[log.toolId].usageByTime[timeKey] || 0) + (log.quantity || 1);
            itemStats[log.toolId].Total += (log.quantity || 1);
        });

        // Format rows with fixed columns depending on report type
        data = Object.values(itemStats).map((item: any) => {
            const row: any = {
                "Tag ID": item["Tag ID"],
                "Items Description": item["Items Description"],
                "UoM": item["UoM"],
            };

            if (type === "daily_item") {
                row["Qty Used"] = item.Total;
            } else if (type === "weekly_item") {
                const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                days.forEach(day => {
                    row[day] = item.usageByTime[day] || 0;
                });
            } else if (type === "monthly_item") {
                for (let i = 1; i <= 31; i++) {
                    row[i.toString()] = item.usageByTime[i.toString()] || 0;
                }
            }

            row["Total"] = item.Total;
            return row;
        });

        // Sort by Tag ID
        data.sort((a, b) => (a["Tag ID"] > b["Tag ID"] ? 1 : -1));
    }

    if (data.length === 0) {
        data = [{ Message: `No data found between ${startDate} and ${endDate}` }];
    }

    const ws = xlsx.utils.json_to_sheet(data);

    // Apply styles to headers and cells (using xlsx-js-style properties)
    const range = xlsx.utils.decode_range(ws['!ref'] || "A1:A1");
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = xlsx.utils.encode_cell({ c: C, r: R });
            if (!ws[cellAddress]) continue;

            const borderStyle = {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            };

            if (R === 0) {
                // Header Row
                ws[cellAddress].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
                    fill: { fgColor: { rgb: "7F1D1D" } }, // Dark red matching screenshot
                    alignment: { horizontal: "center", vertical: "center", wrapText: true },
                    border: borderStyle
                };
                if (type !== "usage_log" && C === range.e.c) {
                    ws[cellAddress].s.font.color = { rgb: "FF0000" }; // Red header for Total
                    ws[cellAddress].s.fill = { fgColor: { rgb: "F3F4F6" } }; // Light gray bg
                }
            } else {
                // Data Rows
                ws[cellAddress].s = {
                    font: { color: { rgb: "000000" }, sz: 11 },
                    alignment: { horizontal: C === 1 ? "left" : "center", vertical: "center" },
                    border: borderStyle
                };

                // Bold totals or tag columns
                if (type !== "usage_log") {
                    if (C === 0 || C === range.e.c) {
                        ws[cellAddress].s.font.bold = true;
                    }
                    if (C === range.e.c) {
                        ws[cellAddress].s.font.color = { rgb: "DC2626" }; // Red text for total
                    }
                }
            }
        }
    }

    // Set column widths
    if (type === "usage_log") {
        ws['!cols'] = [
            { wch: 15 }, // Date
            { wch: 12 }, // Time
            { wch: 40 }, // Tool Name
            { wch: 15 }, // Tool ID
            { wch: 10 }, // Quantity
            { wch: 25 }, // Worker
            { wch: 20 }, // Department
        ];
    } else {
        const cols = [
            { wch: 15 }, // Tag ID
            { wch: 45 }, // Items Description
            { wch: 12 }, // UoM
        ];
        // Add widths for dynamic time columns
        for (let i = 3; i <= range.e.c; i++) cols.push({ wch: 15 });
        ws['!cols'] = cols;
    }

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Report");

    const excelBuffer = xlsx.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
