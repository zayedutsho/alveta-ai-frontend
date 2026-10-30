const header = document.querySelector<HTMLElement>('[data-header]');
const toggle = header?.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const nav = header?.querySelector<HTMLElement>('nav');
const mobileNavigation = matchMedia('(max-width: 900px)');
let scrollFrame = 0;
function syncScrolledHeader() {
  scrollFrame = 0;
  header?.toggleAttribute('data-scrolled', scrollY > 8);
}
function scheduleScrolledHeader() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(syncScrolledHeader);
}
function syncNavigationAccess() {
  if (nav) nav.inert = mobileNavigation.matches && !header?.hasAttribute('data-menu-open');
}
function closeNavigation(returnFocus = false) {
  if (header?.hasAttribute('data-menu-open')) document.body.style.overflow = '';
  header?.removeAttribute('data-menu-open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Open navigation');
  syncNavigationAccess();
  header?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(menu => { menu.open = false; });
  if (returnFocus) toggle?.focus();
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  if (!open) return closeNavigation();
  header?.setAttribute('data-menu-open', '');
  document.body.style.overflow = 'hidden';
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Close navigation');
  syncNavigationAccess();
});
syncNavigationAccess();
syncScrolledHeader();
window.addEventListener('scroll', scheduleScrolledHeader, { passive: true });
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !header?.contains(document.activeElement)) return;
  const details = document.activeElement?.closest<HTMLDetailsElement>('details[open]');
  if (details) { details.open = false; details.querySelector('summary')?.focus(); }
  else closeNavigation(true);
});
document.addEventListener('click', event => {
  if (event.target instanceof Node && (!header?.contains(event.target) || event.target === header)) closeNavigation();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Tab' || !mobileNavigation.matches || !header?.hasAttribute('data-menu-open')) return;
  const focusable = [...header.querySelectorAll<HTMLElement>('a, button, summary, input')].filter(el => el.getClientRects().length);
  const first = focusable[0], last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
});
nav?.addEventListener('click', event => {
  if (event.target instanceof Element && event.target.closest('a')) closeNavigation();
});
header?.querySelectorAll<HTMLDetailsElement>('details').forEach(menu => {
  menu.addEventListener('toggle', () => {
    if (menu.open) header.querySelectorAll<HTMLDetailsElement>('details').forEach(other => { if (other !== menu) other.open = false; });
  });
});
matchMedia('(min-width: 901px)').addEventListener('change', () => closeNavigation());
