import sharp from 'sharp';
import path from 'path';
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
console.log('Done.');
