// 开场信封：点击/回车打开，flap 翻开动画结束后平滑滚动到下一屏。

export function initEnvelope() {
  const envelope = document.getElementById('envelope');
  if (!envelope) return;

  const screen = envelope.closest('.envelope-screen');
  const nextScreen = screen?.nextElementSibling;
  const flap = envelope.querySelector('.envelope-flap');
  const hint = screen?.querySelector('.envelope-hint');
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let opened = false;

  function scrollToNext() {
    nextScreen?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function open() {
    if (opened) return;
    opened = true;
    envelope.classList.add('is-open');
    envelope.setAttribute('aria-expanded', 'true');
    if (hint) hint.style.opacity = '0';

    if (reduceMotion) {
      scrollToNext();
    } else {
      flap.addEventListener('transitionend', scrollToNext, { once: true });
    }
  }

  envelope.addEventListener('click', open);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
}
