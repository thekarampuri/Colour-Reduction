const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, 'ColorReduction (8).html');
const content = fs.readFileSync(sourceFile, 'utf8');

// Extract CSS
const cssMatch = content.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
  const cssDir = path.join(__dirname, 'styles');
  if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });
  fs.writeFileSync(path.join(cssDir, 'legacy.css'), cssMatch[1].trim());
}

// Extract JS
const jsMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (jsMatch) {
  const libDir = path.join(__dirname, 'lib');
  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });
  fs.writeFileSync(path.join(libDir, 'legacyLogic.js'), jsMatch[1].trim());
}

// Extract HTML
const bodyMatch = content.match(/<div id="app">([\s\S]*?)<\/script>/);
if (bodyMatch) {
  let htmlContent = bodyMatch[1].trim();
  // We need to stop before the <script>
  htmlContent = '<div id="app">\n' + htmlContent;

  const componentsDir = path.join(__dirname, 'components');
  if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

  const componentCode = `
import React, { useEffect } from 'react';

export default function LegacyApp() {
  useEffect(() => {
    // Dynamically import the legacy logic only on the client side
    if (typeof window !== 'undefined') {
      import('../lib/legacyLogic.js').catch(err => console.error("Failed to load legacy logic:", err));
    }
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: \`${'`'}\${htmlContent}\`${'`'} }} />
  );
}
`;
  fs.writeFileSync(path.join(componentsDir, 'LegacyApp.tsx'), componentCode);
}

console.log("Extraction completed successfully!");

