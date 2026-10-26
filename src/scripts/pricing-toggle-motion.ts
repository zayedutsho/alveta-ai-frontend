export {};

const section = document.querySelector<HTMLElement>('[data-pricing]');
const toggle = section?.querySelector<HTMLFieldSetElement>('[data-pricing-toggle]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (section && toggle && !reducedMotion.matches && 'IntersectionObserver' in window) {
  const individual = toggle.querySelector<HTMLInputElement>('[value="individual"]')!;
  const team = toggle.querySelector<HTMLInputElement>('[value="team"]')!;
  let entered = false;
  let played = false;

  const finish = () => {
    played = true;
    toggle.removeAttribute('data-border-transfer');
    viewport.disconnect();
    availability.disconnect();
    toggle.removeEventListener('pointerdown', finish);
    toggle.removeEventListener('keydown', finish);
    toggle.removeEventListener('change', finish);
    toggle.removeEventListener('animationend', onAnimationEnd);
    reducedMotion.removeEventListener('change', finish);
  };
  const start = () => {
    if (played || !entered || !toggle.getClientRects().length || team.closest('[hidden]')) return;
    if (!individual.checked || reducedMotion.matches) { finish(); return; }
    played = true;
    viewport.disconnect();
    availability.disconnect();
    toggle.setAttribute('data-border-transfer', 'running');
  };
  const onAnimationEnd = (event: AnimationEvent) => {
    if (event.target === individual.parentElement && event.pseudoElement === '::before') finish();
  };
  const viewport = new IntersectionObserver(entries => {
    entered = entries.some(entry => entry.isIntersecting);
    start();
  }, { threshold: 0 });
  // The API may reveal the controls after the section has entered the viewport.
  const availability = new MutationObserver(start);
  availability.observe(toggle.parentElement!, { attributes: true, subtree: true, attributeFilter: ['hidden'] });
  toggle.addEventListener('pointerdown', finish);
  toggle.addEventListener('keydown', finish);
  toggle.addEventListener('change', finish);
  toggle.addEventListener('animationend', onAnimationEnd);
  reducedMotion.addEventListener('change', finish);
  viewport.observe(section);
}
