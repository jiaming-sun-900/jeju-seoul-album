import './style.css';
import { jeju, seoul } from './photos.js';
import { initReveal } from './reveal.js';
import { createLightbox } from './lightbox.js';

// 单张图片尺寸自动交替节奏：宽 -> 常规 -> 窄 -> 常规 ...
// 想强制某张图的尺寸，在 photos.js 里给它加 size 字段覆盖即可。
const SIZE_PATTERN = ['wide', 'regular', 'narrow', 'regular'];

function sizeClassFor(index, override) {
  return override || SIZE_PATTERN[index % SIZE_PATTERN.length];
}

function alignClassFor(index, sizeClass) {
  if (sizeClass === 'wide') return 'align-center';
  return index % 2 === 0 ? 'align-left' : 'align-right';
}

const IMAGES_BASE = `${import.meta.env.BASE_URL}images/`;

function imgSrc(name) {
  return `${IMAGES_BASE}${name}.webp`;
}

function imgSrcset(name) {
  return `${imgSrc(name)} 1200w, ${IMAGES_BASE}${name}-2x.webp 2000w`;
}

function buildImg(name, caption, lightboxIndex) {
  const img = document.createElement('img');
  img.src = imgSrc(name);
  img.srcset = imgSrcset(name);
  img.sizes = '(max-width: 800px) 100vw, 90vw';
  img.alt = caption || '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.className = 'photo-img';
  img.dataset.lightboxIndex = String(lightboxIndex);
  return img;
}

function renderGallery(container, photos, lightboxImages) {
  photos.forEach((photo, index) => {
    const figure = document.createElement('figure');
    figure.className = 'reveal photo-figure';

    if (photo.pair) {
      figure.classList.add('photo-pair');
      photo.pair.forEach((name) => {
        const lightboxIndex = lightboxImages.length;
        lightboxImages.push({
          full: `${IMAGES_BASE}${name}-2x.webp`,
          alt: photo.caption || '',
          caption: photo.caption || '',
        });
        const wrap = document.createElement('div');
        wrap.className = 'pair-item';
        wrap.appendChild(buildImg(name, photo.caption, lightboxIndex));
        figure.appendChild(wrap);
      });
    } else {
      const sizeClass = sizeClassFor(index, photo.size);
      figure.classList.add(`size-${sizeClass}`, alignClassFor(index, sizeClass));
      const lightboxIndex = lightboxImages.length;
      lightboxImages.push({
        full: `${IMAGES_BASE}${photo.name}-2x.webp`,
        alt: photo.caption || '',
        caption: photo.caption || '',
      });
      figure.appendChild(buildImg(photo.name, photo.caption, lightboxIndex));
    }

    if (photo.caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = photo.caption;
      figure.appendChild(figcaption);
    }

    container.appendChild(figure);
  });
}

function init() {
  const lightboxImages = [];
  const jejuContainer = document.getElementById('jeju-gallery');
  const seoulContainer = document.getElementById('seoul-gallery');

  renderGallery(jejuContainer, jeju, lightboxImages);
  renderGallery(seoulContainer, seoul, lightboxImages);

  const lightbox = createLightbox(lightboxImages);
  document.querySelectorAll('.photo-img').forEach((img) => {
    img.addEventListener('click', () => {
      lightbox.open(Number(img.dataset.lightboxIndex));
    });
  });

  initReveal();
}

init();
