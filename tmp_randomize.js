import fs from 'fs';

const apiPath = 'src/features/tools/toolsApi.ts';
let code = fs.readFileSync(apiPath, 'utf8');

// Replace all 'stockLevel: 0' in the initialTools array with random numbers
code = code.replace(/stockLevel:\s*0/g, () => {
    // Generate a random stock level between 10 and 250
    const randomStock = Math.floor(Math.random() * 240) + 10;
    return `stockLevel: ${randomStock}`;
});

// Increment the storage key so the frontend drops the old cached version
code = code.replace(/factorylog_mock_tools_v(\d+)/, (match, versionStr) => {
    const version = parseInt(versionStr, 10);
    return `factorylog_mock_tools_v${version + 1}`;
});

fs.writeFileSync(apiPath, code);
console.log('Randomized stock levels successfully.');
