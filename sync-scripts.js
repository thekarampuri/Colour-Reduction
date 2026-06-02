const fs = require('fs');

const logic = fs.readFileSync('public/legacyLogic.js', 'utf8');

// Update ColorReduction (8).html
const htmlPath = 'ColorReduction (8).html';
let html = fs.readFileSync(htmlPath, 'utf8');
const scriptStart = '<script>';
const scriptEnd = '</script>';
const startIdx = html.indexOf(scriptStart);
const endIdx = html.lastIndexOf(scriptEnd);
if (startIdx !== -1 && endIdx !== -1) {
    const newHtml = html.substring(0, startIdx + scriptStart.length) + '\n' + logic + '\n' + html.substring(endIdx);
    fs.writeFileSync(htmlPath, newHtml, 'utf8');
    console.log('Updated ColorReduction (8).html');
}

// Update LegacyApp.tsx
const tsxPath = 'components/LegacyApp.tsx';
let tsx = fs.readFileSync(tsxPath, 'utf8');
const tsxStartIdx = tsx.indexOf(scriptStart);
const tsxEndIdx = tsx.lastIndexOf(scriptEnd);
if (tsxStartIdx !== -1 && tsxEndIdx !== -1) {
    const newTsx = tsx.substring(0, tsxStartIdx + scriptStart.length) + '\n' + logic + '\n' + tsx.substring(tsxEndIdx);
    fs.writeFileSync(tsxPath, newTsx, 'utf8');
    console.log('Updated LegacyApp.tsx');
}
