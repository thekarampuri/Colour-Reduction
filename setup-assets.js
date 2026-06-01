/**
 * setup-assets.js
 * Run once: node setup-assets.js
 * Creates the assets/ folder and copies the logo images there with clean names.
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const assetsDir = path.join(root, 'assets');

// Ensure assets dir exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('Created assets/ folder');
}

// Files to copy: [source, destination]
const copies = [
  ['COLOR REDUCTION LEFT PANEL CORNER LOGO.PNG', 'assets/logo-panel.png'],
  ['COLOR REDUCTION APP icon.PNG',                'assets/app-icon.png'],
];

copies.forEach(([src, dest]) => {
  const srcPath  = path.join(root, src);
  const destPath = path.join(root, dest);
  if (!fs.existsSync(srcPath)) {
    console.warn(`SKIP (not found): ${src}`);
    return;
  }
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied → ${dest}`);
});

console.log('\nDone. Now run: npm run dist');
