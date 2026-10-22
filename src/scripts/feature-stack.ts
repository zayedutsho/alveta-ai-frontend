/** Sticky stacking only where every card fits; normal document flow is the fallback. */
export {};
const section = document.querySelector<HTMLElement>('[data-features]');
const cards = [...document.querySelectorAll<HTMLElement>('[data-feature-panel]')];
const desktop = matchMedia('(min-width: 1024px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

if (section && cards.length && 'IntersectionObserver' in window && 'ResizeObserver' in window && CSS.supports('position', 'sticky')) {
  const tops = cards.map((_, i) => 24 + i * 12);
  let origins: number[] = [], heights: number[] = [];
  let active = false, nearby = false, frame = 0, measuring = false;
  const scales: string[] = [];
  cards.forEach((card, i) => card.style.setProperty('--stack-index', String(i)));

  function render() {
    frame = 0;
    if (!active || document.hidden) return;
    const progress = cards.map((_, i) => i === cards.length - 1 ? 0 : Math.max(0, Math.min(1,
      (scrollY + tops[i]! + heights[i]! - origins[i + 1]!) / (heights[i]! - 12))));
    cards.forEach((card, i) => {
      const depth = progress.slice(i).reduce((sum, value) => sum + value, 0);
      const scale = (1 - Math.min(.08, depth * .02)).toFixed(4);
      if (scales[i] !== scale) { card.style.setProperty('--stack-scale', scale); scales[i] = scale; }
    });
  }
  function schedule() {
    if (active && nearby && !document.hidden && !frame) frame = requestAnimationFrame(render);
  }
  function syncScrollListener() {
    window.removeEventListener('scroll', schedule);
    if (active && nearby && !document.hidden) window.addEventListener('scroll', schedule, { passive: true });
    else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  }
  function measure() {
    measuring = false;
    section!.removeAttribute('data-stack-active');
    origins = cards.map(card => {
      let top = 0, node: HTMLElement | null = card;
      while (node) { top += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
      return top;
    });
    heights = cards.map(card => card.offsetHeight);
    active = desktop.matches && !reduced.matches && heights.every((height, i) => height + tops[i]! + 48 <= innerHeight);
    section!.toggleAttribute('data-stack-active', active);
    if (active) cards.forEach(card => { delete card.dataset.motionEntering; });
    if (!active) cards.forEach((card, i) => { card.style.removeProperty('--stack-scale'); scales[i] = ''; });
    syncScrollListener();
    render();
  }
  function scheduleMeasure() {
    if (!measuring) { measuring = true; requestAnimationFrame(measure); }
  }
  const visibility = new IntersectionObserver(entries => {
    nearby = entries[0]!.isIntersecting;
    syncScrollListener();
    schedule();
  }, { rootMargin: '200px 0px' });
  visibility.observe(section);
  const resize = new ResizeObserver(scheduleMeasure);
  resize.observe(section);
  const hero = document.querySelector('.hero');
  if (hero) resize.observe(hero);
  window.addEventListener('resize', scheduleMeasure, { passive: true });
  desktop.addEventListener('change', scheduleMeasure);
  reduced.addEventListener('change', measure);
  document.addEventListener('visibilitychange', () => { syncScrollListener(); schedule(); });
  cards.forEach((card, i) => card.addEventListener('focusin', event => {
    if (active && event.target instanceof Element && event.target.matches(':focus-visible') && scales[i] && Number(scales[i]) < 1) {
      // Restore a covered card before its CTA receives keyboard interaction.
      window.scrollTo({ top: origins[i]! - tops[i]!, behavior: 'instant' });
      render();
    }
  }));
  void document.fonts.ready.then(scheduleMeasure);
  measure();
}
