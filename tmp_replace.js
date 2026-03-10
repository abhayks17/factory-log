const fs = require('fs');
const newTools = fs.readFileSync('tools_generated.ts', 'utf8');
let apiCode = fs.readFileSync('src/features/tools/toolsApi.ts', 'utf8');

// Update Interface
apiCode = apiCode.replace(/export interface Tool \{[^}]+\}/, `export interface Tool {
    id: string;
    toolId: string;
    name: string;
    department: string;
    stockLevel: number;
    uom: string;
}`);

// Update mock data array
const arrayRegex = /const initialTools: Tool\[\] = \[[^\]]+\];/;
apiCode = apiCode.replace(arrayRegex, 'const initialTools: Tool[] = ' + newTools + ';');

// Change storage key to break cache and load new items immediately
apiCode = apiCode.replace('const STORAGE_KEY = "factorylog_mock_tools";', 'const STORAGE_KEY = "factorylog_mock_tools_v2";');

fs.writeFileSync('src/features/tools/toolsApi.ts', apiCode);
