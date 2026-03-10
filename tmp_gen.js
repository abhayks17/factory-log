import fs from 'fs';

const data = `A1 - Water Miscible-MOLVER (Drum)
A3 - THIOVER BASE - Green Drum (Drum)
A4 - THIOVER CATALYST - Black Pail (Pail)
A5 - BUTYLVER INSULATING (Box)
A6 - Dowsil 982 FS silicone - Blue Drum (Drum)
A6-B - Dow 2 Part Black - Small Blue Pail (Pail)
A7 - I.G.W. 55:1 INDUSTRIAL GLASS (Box)
A22 - Digesil NC-Stripper (Box)
A29 - Shadow Gray - RC3-3431 (Pail)
A30 - Steel Wool - RC3-1396 (Pail)
A33-S - Deep Space- RC3-1756 (Pail)
A46 - Pewter - RC3-0869 (Pail)
A50 - Telegrey - RC3-2646 (Pail)
A57 - BLACK Ceramic- SX2439E808 (Pail)
A63 - Rock Quarry - RC3-8183 (Pail)
A64 - Whale Gray - RC3-5239 (Pail)
A66 - Light White - RC0-0186 (Pail)
A68 - Warm Gray - RC3-0770 (Pail)
A73 - Brown Suede - RC4-3694LI (Pail)
A74 - Custom Black - RCI-0532 (Pail)
A75 - Ceramic ETCH- SX8931E808 (Pail)
A76 - Standard Black Gray - RC3-967 (Pail)
A78 - Primary White - RC0-1060 (Pail)
A81 - COSMIC GRAY -RC3-3747 (Pail)
A82 - Surface One White - EX80508E808 (Pail)
A83 - Surface One Etch - EX80507E808 (Pail)
A85 - THORN GRAY-RC3-4595 (Pail)
A86 - MEDIUM GRAY -RC3-0586 (Pail)
A87 - GUN METAL (CERAMIC) (Pail)
A90 - HARMONY GRAY-RC3-820 (Pail)
A91 - Graphite - RC1-0604 (Pail)
A95 - Signal Grey - RC3-2868 (Pail)
A97 - Metallic Mist - RC3-8153 (Pail)
A99 - Harmony Graylite - RC3-747 (Pail)
A100 - Blue Birdie RC6-1595 (Pail)
A105 - Anchor Gray - RC3-2803 (Pail)
A108 - Lava Bronze - RC4-975 (Pail)

A36 - 6MM CLEAR FLOAT (Unit)
A36-V - 6MM CLEAR FLOAT-Vito (Unit)
A37 - 6MM KS150 COOlLITE (Unit)
A38 - 6MM KNT155 (Unit)
A101 - 5MM SN68T-HT (Unit)
A41 - 6MM 78/65- 100 x 144" (Unit)
A96 - 6MM 78/65- 130 x 102" (Unit)
A42 - 6MM SN68-HT (Unit)
A43 - 5MM CLEAR FLOAT (Unit)
A56 - 10MM CLEAR FLOAT (Unit)
A44 - 6MM SN68-LE (Unit)
A47 - SG SNR 43 HT (Unit)
A48 - BIRD FRIENDLY 50X50 (Unit)
A98 - 6MM CLGL VELOUR (Unit)
A102 - 6MM CLEAR: 96x130" (Unit)
A106 - 6MM CLEAR -GRAY (Unit)
A107 - 6MM Acid- 102 x 144 (Unit)

A9 - 11.5 Spacer (Box)
A10 - 12.5 Spacer (Box)
A11 - 14.5 Spacer (Box)
A12 - 15.5 Spacer (Box)
A13 - 19.5 Spacer (Box)
A14 - 23.5 Spacer (Box)
A49 - 12.5 Spacer-Ultra S Spacer Black (Box)
A51 - 11.5 Spacer-Thermix TX Pro Black (Box)
A52 - 17.5 Spacer-Black (Box)
A70 - 17.5 Spacer-Black-Aluminum (Box)
A53 - 19.5 Spacer-Black (Box)
A54 - 23.5 Spacer-Black (Box)
A58 - 12.5 Spacer-Black Warm Edge (Box)
A59 - 9.5 Spacer - Black (Box)
A60 - 9.5 Spacer- SS Black (Box)
A72 - 15.5 Spacer-Black Warm Edge (Box)
A77 - 11.5 Spacer Ultra S Spacer Black (Box)
A79 - 7.5 Spacer (Box)
A88 - 4.5 Spacer Non Bendable (Box)
A92 - 9.5 Spacer (Box)
A93 - 7.9 Spacer (Box)
A103 - 21.4 Ultra S Spacer Black (Box)
A110 - 19.05 Ultra Spacer Black (Box)

A15 - 11.5 Connector (Box)
A16 - 12.5 Connector (Box)
A17 - 14.5 Connector (Box)
A18 - 15.5 Connector (Box)
A19 - 19.5 Connector (Box)
A20 - 23.5 Connector (Box)
A67 - 17.5 Connector (Box)
A71 - 17.5 Connector-Aluminum (Box)
A55 - 11.5 Corner - Black- No Hole (Box)
A61 - 9.5 Connector - Steel Connectors (Box)
A62 - 9.5 Corners Nylon Corners (Box)
A80 - 7.5 Connectors Nylon Corners (Box)
A84 - 7.5 Connectors - Steel Connectors (Box)
A89 - 4.5 Connector - Corners (Box)
A104 - 21.4 Ultra Steel Connectors (Box)
A111 - 19.05 Ultra Steel Connectors (Box)`;

const lines = data.split('\n').filter(l => l.trim().length > 0);
const tools = lines.map((line, index) => {
    const match = line.match(/^([A-Z0-9\-]+)\s*-\s*(.*?)\s*\((.*?)\)$/);
    if (match) {
        return {
            id: String(index + 1),
            toolId: match[1],
            name: match[2].trim().replace(/"/g, '\\"'),
            uom: match[3],
            department: "Glass Line",
            stockLevel: 0
        };
    }
    console.log("Failed to match:", line);
    return null;
}).filter(Boolean);

let out = "[\n";
for (const tool of tools) {
    out += `        { id: "${tool.id}", toolId: "${tool.toolId}", name: "${tool.name}", uom: "${tool.uom}", department: "Glass Line", stockLevel: 0 },\n`;
}
out += "    ]";

fs.writeFileSync('tools_generated.ts', out);
