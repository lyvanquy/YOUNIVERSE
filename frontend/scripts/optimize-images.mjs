import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const IMAGES_DIR = join(import.meta.dirname, '..', 'public', 'images');
const MAX_WIDTH = 1200; // max width for large images
const SMALL_MAX_WIDTH = 600; // for team/small images
const QUALITY = 80; // JPEG quality

async function optimizeImages() {
  const files = await readdir(IMAGES_DIR);
  
  for (const file of files) {
    const filePath = join(IMAGES_DIR, file);
    const fileStat = await stat(filePath);
    
    // Skip if less than 500KB (already optimized)
    if (fileStat.size < 500 * 1024) continue;
    
    // Only process jpg/png
    if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;
    
    // Skip logo and banner files
    if (file.includes('logo') || file.includes('banner')) continue;
    
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();
      
      // Determine max width based on image type
      const isSmall = file.includes('team-') || file.includes('small') || file.includes('testimonial-minh');
      const maxW = isSmall ? SMALL_MAX_WIDTH : MAX_WIDTH;
      
      const needsResize = metadata.width > maxW;
      
      let pipeline = sharp(filePath);
      
      if (needsResize) {
        pipeline = pipeline.resize(maxW, null, { withoutEnlargement: true });
      }
      
      // Convert to JPEG for smaller size
      const outputPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.jpg');
      await pipeline
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(outputPath + '.tmp');
      
      // Replace original
      const { rename, unlink } = await import('fs/promises');
      
      // If original was PNG and output is JPG, remove PNG
      if (filePath !== outputPath) {
        await unlink(filePath).catch(() => {});
      }
      await rename(outputPath + '.tmp', outputPath);
      
      const newStat = await stat(outputPath);
      const reduction = ((1 - newStat.size / fileStat.size) * 100).toFixed(0);
      console.log(`✅ ${file}: ${(fileStat.size/1024/1024).toFixed(1)}MB → ${(newStat.size/1024/1024).toFixed(1)}MB (-${reduction}%)`);
      
    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`);
    }
  }
  
  console.log('\n🎉 Done!');
}

optimizeImages();
