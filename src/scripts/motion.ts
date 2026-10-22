/** Progressive enhancement: nothing is hidden while waiting for JavaScript or an observer. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets = document.querySelectorAll<HTMLElement>([
  '[data-customer-logos] .logo-rows',
  '[data-features] > .section-heading', '[data-feature-panel]',
  '[data-latest-models] .section-heading', '[data-latest-models] .model-cards',
  '[data-subscription-comparison] .section-heading', '[data-subscription-comparison] .comparison-canvas',
  '[data-pricing] .section-heading', '[data-pricing] .plan-grid',
  '[data-testimonials] h2', '[data-testimonials] .cards',
  '[data-faq] .section-heading', '[data-faq] .columns',
  '[data-articles] h2', '[data-articles] .cards',
  '[data-closing-cta] .copy', '[data-footer] .top',
].join(','));

if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const target = entry.target as HTMLElement;
      reveals.unobserve(target);
      target.dataset.motionEntered = '';
      const stacking = target.matches('[data-feature-panel]') && target.closest('[data-stack-active]');
      if (!stacking && !reduced.matches && !document.hidden && !target.contains(document.activeElement)) target.dataset.motionEntering = '';
    }
  }, { threshold: .08 });
  revealTargets.forEach((target, index) => {
    target.dataset.motionReveal = '';
    // A small alternate offset avoids turning a long page into a slow cascading sequence.
    target.style.setProperty('--motion-delay', `calc(var(--motion-stagger) * ${index % 2})`);
    const finish = (event: AnimationEvent) => {
      if (event.target === target) delete target.dataset.motionEntering;
    };
    target.addEventListener('animationend', finish);
    target.addEventListener('animationcancel', finish);
    reveals.observe(target);
  });

  // Keep authored marquee/keyframes intact; only suspend work outside the viewport or tab.
  const loops = document.querySelectorAll<HTMLElement>('[data-customer-logos], .feature-illustration.comparison');
  const near = new WeakMap<Element, boolean>();
  const sync = () => loops.forEach(scope => {
    scope.toggleAttribute('data-motion-suspended', reduced.matches || document.hidden || !near.get(scope));
  });
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => near.set(entry.target, entry.isIntersecting));
    sync();
  }, { rootMargin: '120px 0px' });
  loops.forEach(scope => { visibility.observe(scope); });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', () => {
    if (reduced.matches) revealTargets.forEach(target => { delete target.dataset.motionEntering; });
    sync();
  });
  sync();
}
