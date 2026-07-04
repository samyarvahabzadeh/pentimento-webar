/**
 * QR Code Generator for Pentimento WebAR
 * Generates QR code as SVG and saves it
 * 
 * Usage: node scripts/generate-qr.js [url]
 * If no URL provided, uses placeholder
 */

// Simple QR Code SVG generator using native Node.js
// Since we can't install the qrcode npm package (canvas dependency),
// we generate a placeholder QR SVG that you should replace after deployment.

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const url = process.argv[2] || 'https://pentimento-webar.vercel.app';

// Generate a stylized QR-like SVG placeholder
function generateQRPlaceholder(data, size = 400) {
  // Simple hash-based pattern to create QR-like appearance
  const modules = 25;
  const moduleSize = size / modules;
  
  let rects = '';
  
  // Fixed patterns (position detection patterns)
  const addFinderPattern = (startX, startY) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isBlack = (
          y === 0 || y === 6 || x === 0 || x === 6 ||
          (y >= 2 && y <= 4 && x >= 2 && x <= 4)
        );
        if (isBlack) {
          rects += `<rect x="${(startX + x) * moduleSize}" y="${(startY + y) * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="#1a1410"/>`;
        }
      }
    }
  };
  
  // Three finder patterns
  addFinderPattern(1, 1);
  addFinderPattern(modules - 8, 1);
  addFinderPattern(1, modules - 8);
  
  // Generate pseudo-random data modules based on URL hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash |= 0;
  }
  
  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      // Skip finder pattern areas
      if ((x <= 8 && y <= 8) || (x >= modules - 8 && y <= 8) || (x <= 8 && y >= modules - 8)) continue;
      
      // Create pattern based on hash
      const val = Math.abs((hash * (x + 1) * (y + 1) + x * 37 + y * 53) % 100);
      if (val < 45) {
        rects += `<rect x="${x * moduleSize}" y="${y * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="#1a1410" rx="1"/>`;
      }
    }
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="white" rx="8"/>
  <g>
    ${rects}
  </g>
  <!-- URL: ${data} -->
  <!-- NOTE: This is a visual placeholder. Replace with a real QR code. -->
  <!-- Use https://www.qr-code-generator.com or similar tool. -->
</svg>`;
}

// Generate QR SVG
const qrSvg = generateQRPlaceholder(url);

// Save
const qrDir = join(projectRoot, 'public', 'qr');
mkdirSync(qrDir, { recursive: true });
writeFileSync(join(qrDir, 'qr.svg'), qrSvg);

console.log(`QR placeholder generated for: ${url}`);
console.log(`Saved to: public/qr/qr.svg`);
console.log(`\n⚠️  This is a visual placeholder QR code.`);
console.log(`To generate a real scannable QR code:`);
console.log(`1. Go to https://www.qr-code-generator.com`);
console.log(`2. Enter your deployed URL: ${url}`);
console.log(`3. Download as PNG and save to public/qr/qr.png`);
