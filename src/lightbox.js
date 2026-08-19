// 极简灯箱：点击图片放大，支持左右切换、ESC / 点击背景关闭、触摸滑动。

export function createLightbox(images) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="关闭">&times;</button>
    <button class="lightbox-prev" aria-label="上一张">&#8249;</button>
    <img class="lightbox-img" alt="" />
    <button class="lightbox-next" aria-label="下一张">&#8250;</button>
    <p class="lightbox-caption"></p>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('.lightbox-img');
  const captionEl = overlay.querySelector('.lightbox-caption');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');

  let currentIndex = 0;
  let touchStartX = null;

  function render() {
    const item = images[currentIndex];
    imgEl.src = item.full;
    imgEl.alt = item.alt || '';
    captionEl.textContent = item.caption || '';
    captionEl.hidden = !item.caption;
  }

  function open(index) {
    currentIndex = index;
    render();
    overlay.classList.add('is-open');
    document.body.classList.add('lightbox-locked');
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('lightbox-locked');
    document.removeEventListener('keydown', onKeydown);
  }

  function next() {
    currentIndex = (currentIndex + 1) % images.length;
    render();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    render();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  overlay.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );
  overlay.addEventListener(
    'touchend',
    (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next();
        else prev();
      }
      touchStartX = null;
    },
    { passive: true }
  );

  return { open, close };
}
