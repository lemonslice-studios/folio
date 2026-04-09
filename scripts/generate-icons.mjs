import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '../public/folio.svg');
const OUT = path.join(__dirname, '../public/icons');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Generating icons from folio.svg...');
await Promise.all(
    SIZES.map(async (size) => {
        const dest = path.join(OUT, `icon-${size}x${size}.png`);
        await sharp(SRC).resize(size, size).png().toFile(dest);
        console.log(`  icon-${size}x${size}.png`);
    })
);

// Generate favicon.ico (multi-size: 16, 32, 48)
console.log('Generating favicon.ico...');
const icoSizes = [16, 32, 48];
const pngBuffers = await Promise.all(
    icoSizes.map((size) => sharp(SRC).resize(size, size).png().toBuffer())
);
const icoBuffer = await pngToIco(pngBuffers);
await fs.writeFile(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
console.log('  favicon.ico');

