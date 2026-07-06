import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

const filesToOptimize = [
  'astra-mat-troi.png',
  'astra-mat-trang.png', 
  'astra-tinh-tu.png',
  'sirius-cho.png',
  'sirius-meo.png',
  'sirius-tra-sua.png',
  'sirius-matcha.png',
  'sirius-ca-phe.png',
];

for (const file of filesToOptimize) {
  const inputPath = path.join(IMAGES_DIR, file);
  const outputName = file.replace('.png', '.jpg');
  const outputPath = path.join(IMAGES_DIR, outputName);

  if (!fs.existsSync(inputPath)) {
    console.log(`SKIP: ${file} not found`);
    continue;
  }

  const sizeBefore = (fs.statSync(inputPath).size / 1024).toFixed(0);

  await sharp(inputPath)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outputPath);

  const sizeAfter = (fs.statSync(outputPath).size / 1024).toFixed(0);
  console.log(`✅ ${file} → ${outputName}: ${sizeBefore}KB → ${sizeAfter}KB`);

  // Remove original PNG
  fs.unlinkSync(inputPath);
}

console.log('\nDone!');
