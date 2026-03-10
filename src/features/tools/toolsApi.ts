import { api } from "@/lib/api";

export interface Tool {
    id: string;
    toolId: string;
    name: string;
    uom: string;
    department: string;
    stockLevel: number;
}
const STORAGE_KEY = "factorylog_mock_tools_v4";

function getMockTools(): Tool[] {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);

    const initialTools: Tool[] = [
        { id: "1", toolId: "A1", name: "Water Miscible-MOLVER", uom: "Drum", department: "Glass Line", stockLevel: 157 },
        { id: "2", toolId: "A3", name: "THIOVER BASE - Green Drum", uom: "Drum", department: "Glass Line", stockLevel: 10 },
        { id: "3", toolId: "A4", name: "THIOVER CATALYST - Black Pail", uom: "Pail", department: "Glass Line", stockLevel: 235 },
        { id: "4", toolId: "A5", name: "BUTYLVER INSULATING", uom: "Box", department: "Glass Line", stockLevel: 132 },
        { id: "5", toolId: "A6", name: "Dowsil 982 FS silicone - Blue Drum", uom: "Drum", department: "Glass Line", stockLevel: 113 },
        { id: "6", toolId: "A6-B", name: "Dow 2 Part Black - Small Blue Pail", uom: "Pail", department: "Glass Line", stockLevel: 103 },
        { id: "7", toolId: "A7", name: "I.G.W. 55:1 INDUSTRIAL GLASS", uom: "Box", department: "Glass Line", stockLevel: 99 },
        { id: "8", toolId: "A22", name: "Digesil NC-Stripper", uom: "Box", department: "Glass Line", stockLevel: 102 },
        { id: "9", toolId: "A29", name: "Shadow Gray - RC3-3431", uom: "Pail", department: "Glass Line", stockLevel: 234 },
        { id: "10", toolId: "A30", name: "Steel Wool - RC3-1396", uom: "Pail", department: "Glass Line", stockLevel: 22 },
        { id: "11", toolId: "A33-S", name: "Deep Space- RC3-1756", uom: "Pail", department: "Glass Line", stockLevel: 191 },
        { id: "12", toolId: "A46", name: "Pewter - RC3-0869", uom: "Pail", department: "Glass Line", stockLevel: 217 },
        { id: "13", toolId: "A50", name: "Telegrey - RC3-2646", uom: "Pail", department: "Glass Line", stockLevel: 158 },
        { id: "14", toolId: "A57", name: "BLACK Ceramic- SX2439E808", uom: "Pail", department: "Glass Line", stockLevel: 171 },
        { id: "15", toolId: "A63", name: "Rock Quarry - RC3-8183", uom: "Pail", department: "Glass Line", stockLevel: 224 },
        { id: "16", toolId: "A64", name: "Whale Gray - RC3-5239", uom: "Pail", department: "Glass Line", stockLevel: 143 },
        { id: "17", toolId: "A66", name: "Light White - RC0-0186", uom: "Pail", department: "Glass Line", stockLevel: 232 },
        { id: "18", toolId: "A68", name: "Warm Gray - RC3-0770", uom: "Pail", department: "Glass Line", stockLevel: 190 },
        { id: "19", toolId: "A73", name: "Brown Suede - RC4-3694LI", uom: "Pail", department: "Glass Line", stockLevel: 183 },
        { id: "20", toolId: "A74", name: "Custom Black - RCI-0532", uom: "Pail", department: "Glass Line", stockLevel: 43 },
        { id: "21", toolId: "A75", name: "Ceramic ETCH- SX8931E808", uom: "Pail", department: "Glass Line", stockLevel: 231 },
        { id: "22", toolId: "A76", name: "Standard Black Gray - RC3-967", uom: "Pail", department: "Glass Line", stockLevel: 160 },
        { id: "23", toolId: "A78", name: "Primary White - RC0-1060", uom: "Pail", department: "Glass Line", stockLevel: 238 },
        { id: "24", toolId: "A81", name: "COSMIC GRAY -RC3-3747", uom: "Pail", department: "Glass Line", stockLevel: 225 },
        { id: "25", toolId: "A82", name: "Surface One White - EX80508E808", uom: "Pail", department: "Glass Line", stockLevel: 14 },
        { id: "26", toolId: "A83", name: "Surface One Etch - EX80507E808", uom: "Pail", department: "Glass Line", stockLevel: 238 },
        { id: "27", toolId: "A85", name: "THORN GRAY-RC3-4595", uom: "Pail", department: "Glass Line", stockLevel: 115 },
        { id: "28", toolId: "A86", name: "MEDIUM GRAY -RC3-0586", uom: "Pail", department: "Glass Line", stockLevel: 97 },
        { id: "29", toolId: "A87", name: "GUN METAL (CERAMIC)", uom: "Pail", department: "Glass Line", stockLevel: 54 },
        { id: "30", toolId: "A90", name: "HARMONY GRAY-RC3-820", uom: "Pail", department: "Glass Line", stockLevel: 113 },
        { id: "31", toolId: "A91", name: "Graphite - RC1-0604", uom: "Pail", department: "Glass Line", stockLevel: 36 },
        { id: "32", toolId: "A95", name: "Signal Grey - RC3-2868", uom: "Pail", department: "Glass Line", stockLevel: 149 },
        { id: "33", toolId: "A97", name: "Metallic Mist - RC3-8153", uom: "Pail", department: "Glass Line", stockLevel: 58 },
        { id: "34", toolId: "A99", name: "Harmony Graylite - RC3-747", uom: "Pail", department: "Glass Line", stockLevel: 28 },
        { id: "35", toolId: "A100", name: "Blue Birdie RC6-1595", uom: "Pail", department: "Glass Line", stockLevel: 165 },
        { id: "36", toolId: "A105", name: "Anchor Gray - RC3-2803", uom: "Pail", department: "Glass Line", stockLevel: 95 },
        { id: "37", toolId: "A108", name: "Lava Bronze - RC4-975", uom: "Pail", department: "Glass Line", stockLevel: 28 },
        { id: "38", toolId: "A36", name: "6MM CLEAR FLOAT", uom: "Unit", department: "Glass Line", stockLevel: 192 },
        { id: "39", toolId: "A36-V", name: "6MM CLEAR FLOAT-Vito", uom: "Unit", department: "Glass Line", stockLevel: 168 },
        { id: "40", toolId: "A37", name: "6MM KS150 COOlLITE", uom: "Unit", department: "Glass Line", stockLevel: 94 },
        { id: "41", toolId: "A38", name: "6MM KNT155", uom: "Unit", department: "Glass Line", stockLevel: 49 },
        { id: "42", toolId: "A101", name: "5MM SN68T-HT", uom: "Unit", department: "Glass Line", stockLevel: 164 },
        { id: "43", toolId: "A41", name: "6MM 78/65- 100 x 144\\\"", uom: "Unit", department: "Glass Line", stockLevel: 148 },
        { id: "44", toolId: "A96", name: "6MM 78/65- 130 x 102\\\"", uom: "Unit", department: "Glass Line", stockLevel: 72 },
        { id: "45", toolId: "A42", name: "6MM SN68-HT", uom: "Unit", department: "Glass Line", stockLevel: 135 },
        { id: "46", toolId: "A43", name: "5MM CLEAR FLOAT", uom: "Unit", department: "Glass Line", stockLevel: 169 },
        { id: "47", toolId: "A56", name: "10MM CLEAR FLOAT", uom: "Unit", department: "Glass Line", stockLevel: 160 },
        { id: "48", toolId: "A44", name: "6MM SN68-LE", uom: "Unit", department: "Glass Line", stockLevel: 244 },
        { id: "49", toolId: "A47", name: "SG SNR 43 HT", uom: "Unit", department: "Glass Line", stockLevel: 81 },
        { id: "50", toolId: "A48", name: "BIRD FRIENDLY 50X50", uom: "Unit", department: "Glass Line", stockLevel: 164 },
        { id: "51", toolId: "A98", name: "6MM CLGL VELOUR", uom: "Unit", department: "Glass Line", stockLevel: 244 },
        { id: "52", toolId: "A102", name: "6MM CLEAR: 96x130\\\"", uom: "Unit", department: "Glass Line", stockLevel: 175 },
        { id: "53", toolId: "A106", name: "6MM CLEAR -GRAY", uom: "Unit", department: "Glass Line", stockLevel: 221 },
        { id: "54", toolId: "A107", name: "6MM Acid- 102 x 144", uom: "Unit", department: "Glass Line", stockLevel: 229 },
        { id: "55", toolId: "A9", name: "11.5 Spacer", uom: "Box", department: "Glass Line", stockLevel: 160 },
        { id: "56", toolId: "A10", name: "12.5 Spacer", uom: "Box", department: "Glass Line", stockLevel: 204 },
        { id: "57", toolId: "A11", name: "14.5 Spacer", uom: "Box", department: "Glass Line", stockLevel: 53 },
        { id: "58", toolId: "A12", name: "15.5 Spacer", uom: "Box", department: "Glass Line", stockLevel: 178 },
        { id: "59", toolId: "A13", name: "19.5 Spacer", uom: "Box", department: "Glass Line", stockLevel: 143 },
        { id: "60", toolId: "A14", name: "23.5 Spacer", uom: "Box", department: "Glass Line", stockLevel: 140 },
        { id: "61", toolId: "A49", name: "12.5 Spacer-Ultra S Spacer Black", uom: "Box", department: "Glass Line", stockLevel: 237 },
        { id: "62", toolId: "A51", name: "11.5 Spacer-Thermix TX Pro Black", uom: "Box", department: "Glass Line", stockLevel: 211 },
        { id: "63", toolId: "A52", name: "17.5 Spacer-Black", uom: "Box", department: "Glass Line", stockLevel: 34 },
        { id: "64", toolId: "A70", name: "17.5 Spacer-Black-Aluminum", uom: "Box", department: "Glass Line", stockLevel: 20 },
        { id: "65", toolId: "A53", name: "19.5 Spacer-Black", uom: "Box", department: "Glass Line", stockLevel: 94 },
        { id: "66", toolId: "A54", name: "23.5 Spacer-Black", uom: "Box", department: "Glass Line", stockLevel: 104 },
        { id: "67", toolId: "A58", name: "12.5 Spacer-Black Warm Edge", uom: "Box", department: "Glass Line", stockLevel: 113 },
        { id: "68", toolId: "A59", name: "9.5 Spacer - Black", uom: "Box", department: "Glass Line", stockLevel: 47 },
        { id: "69", toolId: "A60", name: "9.5 Spacer- SS Black", uom: "Box", department: "Glass Line", stockLevel: 60 },
        { id: "70", toolId: "A72", name: "15.5 Spacer-Black Warm Edge", uom: "Box", department: "Glass Line", stockLevel: 193 },
        { id: "71", toolId: "A77", name: "11.5 Spacer Ultra S Spacer Black", uom: "Box", department: "Glass Line", stockLevel: 237 },
        { id: "72", toolId: "A79", name: "7.5 Spacer", uom: "Box", department: "Glass Line", stockLevel: 230 },
        { id: "73", toolId: "A88", name: "4.5 Spacer Non Bendable", uom: "Box", department: "Glass Line", stockLevel: 230 },
        { id: "74", toolId: "A92", name: "9.5 Spacer", uom: "Box", department: "Glass Line", stockLevel: 215 },
        { id: "75", toolId: "A93", name: "7.9 Spacer", uom: "Box", department: "Glass Line", stockLevel: 245 },
        { id: "76", toolId: "A103", name: "21.4 Ultra S Spacer Black", uom: "Box", department: "Glass Line", stockLevel: 38 },
        { id: "77", toolId: "A110", name: "19.05 Ultra Spacer Black", uom: "Box", department: "Glass Line", stockLevel: 27 },
        { id: "78", toolId: "A15", name: "11.5 Connector", uom: "Box", department: "Glass Line", stockLevel: 148 },
        { id: "79", toolId: "A16", name: "12.5 Connector", uom: "Box", department: "Glass Line", stockLevel: 75 },
        { id: "80", toolId: "A17", name: "14.5 Connector", uom: "Box", department: "Glass Line", stockLevel: 66 },
        { id: "81", toolId: "A18", name: "15.5 Connector", uom: "Box", department: "Glass Line", stockLevel: 78 },
        { id: "82", toolId: "A19", name: "19.5 Connector", uom: "Box", department: "Glass Line", stockLevel: 83 },
        { id: "83", toolId: "A20", name: "23.5 Connector", uom: "Box", department: "Glass Line", stockLevel: 63 },
        { id: "84", toolId: "A67", name: "17.5 Connector", uom: "Box", department: "Glass Line", stockLevel: 21 },
        { id: "85", toolId: "A71", name: "17.5 Connector-Aluminum", uom: "Box", department: "Glass Line", stockLevel: 31 },
        { id: "86", toolId: "A55", name: "11.5 Corner - Black- No Hole", uom: "Box", department: "Glass Line", stockLevel: 76 },
        { id: "87", toolId: "A61", name: "9.5 Connector - Steel Connectors", uom: "Box", department: "Glass Line", stockLevel: 47 },
        { id: "88", toolId: "A62", name: "9.5 Corners Nylon Corners", uom: "Box", department: "Glass Line", stockLevel: 196 },
        { id: "89", toolId: "A80", name: "7.5 Connectors Nylon Corners", uom: "Box", department: "Glass Line", stockLevel: 78 },
        { id: "90", toolId: "A84", name: "7.5 Connectors - Steel Connectors", uom: "Box", department: "Glass Line", stockLevel: 198 },
        { id: "91", toolId: "A89", name: "4.5 Connector - Corners", uom: "Box", department: "Glass Line", stockLevel: 138 },
        { id: "92", toolId: "A104", name: "21.4 Ultra Steel Connectors", uom: "Box", department: "Glass Line", stockLevel: 160 },
        { id: "93", toolId: "A111", name: "19.05 Ultra Steel Connectors", uom: "Box", department: "Glass Line", stockLevel: 45 }
    ];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initialTools));
    return initialTools;
}

function saveMockTools(tools: Tool[]) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
}

export async function getTools(): Promise<Tool[]> {
    return getMockTools();
}

export async function createTool(payload: Omit<Tool, "id">): Promise<Tool> {
    const tools = getMockTools();
    const newTool: Tool = { ...payload, id: Date.now().toString() };
    const updated = [newTool, ...tools];
    saveMockTools(updated);
    return newTool;
}

export async function updateTool(id: string, payload: Partial<Tool>): Promise<Tool> {
    const tools = getMockTools();
    const index = tools.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Tool not found");

    const updatedTool = { ...tools[index], ...payload };
    tools[index] = updatedTool;
    saveMockTools(tools);
    return updatedTool;
}

export async function deleteTool(id: string): Promise<void> {
    const tools = getMockTools();
    saveMockTools(tools.filter(t => t.id !== id));
}
