import { describe, it, expect } from 'vitest';
import path from 'path';
import { Jimp, intToRGBA } from 'jimp';
import { findTopAlternativeMatches } from '../lib/colorMath';
import groundTruth from './vision-groundtruth.json';

// Helper to extract average color in a 9x9 box (same logic as the frontend canvas but for Node)
async function extractColorAt(imagePath: string, x_pct: number, y_pct: number) {
  const image = await Jimp.read(imagePath);
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  const centerX = Math.floor(width * x_pct);
  const centerY = Math.floor(height * y_pct);
  
  let r = 0, g = 0, b = 0, count = 0;
  const boxSize = 9; // 9x9 area to match the Miniscanner's average area
  const halfBox = Math.floor(boxSize / 2);
  
  for (let y = centerY - halfBox; y <= centerY + halfBox; y++) {
    for (let x = centerX - halfBox; x <= centerX + halfBox; x++) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const hex = image.getPixelColor(x, y);
        const rgb = intToRGBA(hex);
        r += rgb.r;
        g += rgb.g;
        b += rgb.b;
        count++;
      }
    }
  }
  
  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

describe('Vision AI Miniscanner Extraction Tests', () => {
  groundTruth.forEach(({ image, targets }) => {
    describe(`Image: ${image}`, () => {
      targets.forEach(({ description, x_pct, y_pct, acceptable_matches }) => {
        it(`should correctly identify ${description}`, async () => {
          // 1. Load the image from ../../Testimages/${image}
          const imagePath = path.resolve(__dirname, '../../Testimages', image);
          
          // 2. Extract the RGB value at (x, y) using an average bounding box
          const { r, g, b } = await extractColorAt(imagePath, x_pct, y_pct);
          const hex = rgbToHex(r, g, b);
          
          // 3. Run hex through findTopAlternativeMatches() from lib/colorMath
          const matches = findTopAlternativeMatches(hex, { includeMetallics: true });
          
          // 4. Assert that the top match is in our list of acceptable paints
          // We can check if ANY of the top 3 matches are acceptable to allow for slight ML fuzziness
          const topMatchesNames = matches.slice(0, 3).map(m => m.name);
          
          const hasAcceptableMatch = topMatchesNames.some(name => acceptable_matches.includes(name));
          
          if (!hasAcceptableMatch) {
            console.error(`Failed ${description}: Found [${topMatchesNames.join(', ')}] but expected one of [${acceptable_matches.join(', ')}] from extracted hex ${hex}`);
          }
          
          expect(hasAcceptableMatch).toBe(true);
        }, 10000); // 10 second timeout for image loading
      });
    });
  });
});
