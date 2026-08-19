// 图片滚动进入视口时淡入 + 轻微位移。
// prefers-reduced-motion 时直接显示，不做位移动画。

export function initReveal(selector = '.reveal') {
  const items = document.querySelectorAll(selector);
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (reduceMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
  );

  items.forEach((el) => observer.observe(el));
}
