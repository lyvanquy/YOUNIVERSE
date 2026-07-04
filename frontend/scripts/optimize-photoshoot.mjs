import sharp from 'sharp';
import { stat } from 'fs/promises';
import { join } from 'path';

const IMAGES_DIR = join(import.meta.dirname, '..', 'public', 'images');

async function optimize() {
  for (let i = 1; i <= 11; i++) {
    const file = `photoshoot-${i}.jpg`;
    const filePath = join(IMAGES_DIR, file);
    const fileStat = await stat(filePath);
    
    await sharp(filePath)
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(filePath + '.tmp');
    
    const { rename } = await import('fs/promises');
    await rename(filePath + '.tmp', filePath);
    
    const newStat = await stat(filePath);
    console.log(`✅ ${file}: ${(fileStat.size/1024/1024).toFixed(1)}MB → ${(newStat.size/1024/1024).toFixed(1)}MB`);
  }
  console.log('Done!');
}
optimize();
