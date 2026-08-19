// 批量处理 source-images/{jeju,seoul} 里的原图，输出到 public/images。
//
// 用法：npm run process-images
//
// 对每张图：
//   - 按 EXIF orientation 先摆正（.rotate()），再彻底丢弃元数据（不调用 withMetadata，
//     sharp 默认就不会把 EXIF/GPS/拍摄时间写进输出文件）
//   - 按长边等比压缩到 1200px（移动端，无后缀）和 2000px（桌面端，-2x 后缀），
//     输出 WebP quality 80，不放大小图（withoutEnlargement）
//   - 按原文件名排序后重新编号：jeju-01.webp / jeju-01-2x.webp ...

import { readdir, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const SOURCE_ROOT = new URL('../source-images/', import.meta.url);
const OUTPUT_ROOT = new URL('../public/images/', import.meta.url);

const ALBUMS = ['jeju', 'seoul'];
const SIZES = [
  { suffix: '', width: 1200 },
  { suffix: '-2x', width: 2000 },
];
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);
const QUALITY = 80;

async function processAlbum(album) {
  const sourceDir = new URL(`${album}/`, SOURCE_ROOT);

  let entries;
  try {
    entries = await readdir(sourceDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`跳过：找不到 source-images/${album}`);
      return;
    }
    throw err;
  }

  const files = entries
    .filter((e) => e.isFile() && IMAGE_EXT.has(extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) {
    console.warn(`跳过：source-images/${album} 里没有图片`);
    return;
  }

  await mkdir(OUTPUT_ROOT, { recursive: true });

  for (let i = 0; i < files.length; i++) {
    const srcFile = files[i];
    const baseName = `${album}-${String(i + 1).padStart(2, '0')}`;
    const srcPath = join(new URL(sourceDir).pathname, srcFile);

    for (const { suffix, width } of SIZES) {
      const outPath = join(
        new URL(OUTPUT_ROOT).pathname,
        `${baseName}${suffix}.webp`
      );

      await sharp(srcPath)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);
    }

    console.log(`${srcFile} -> ${baseName}.webp / ${baseName}-2x.webp`);
  }
}

for (const album of ALBUMS) {
  await processAlbum(album);
}

console.log('完成。别忘了把用到的文件名按顺序填进 src/photos.js');
