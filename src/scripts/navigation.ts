import { loadPublicModels } from '../lib/public-catalog';
const header = document.querySelector<HTMLElement>('[data-header]');
const toggle = header?.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const nav = header?.querySelector<HTMLElement>('nav');
const mobileNavigation = matchMedia('(max-width: 900px)');
function syncNavigationAccess() {
  if (nav) nav.inert = mobileNavigation.matches && !header?.hasAttribute('data-menu-open');
}
function closeNavigation(returnFocus = false) {
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
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Close navigation');
  syncNavigationAccess();
});
syncNavigationAccess();
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !header?.contains(document.activeElement)) return;
  const details = document.activeElement?.closest<HTMLDetailsElement>('details[open]');
  if (details) { details.open = false; details.querySelector('summary')?.focus(); }
  else closeNavigation(true);
});
document.addEventListener('click', event => {
  if (event.target instanceof Node && !header?.contains(event.target)) closeNavigation();
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

// Public API only: no JWT, auth-store or refresh-token coupling in marketing.
const modelMenu = document.querySelector<HTMLDetailsElement>('[data-model-menu]');
let modelsLoaded = false;
modelMenu?.addEventListener('toggle', async () => {
  if (!modelMenu.open || modelsLoaded || !modelMenu.dataset.apiOrigin) return;
  const status = modelMenu.querySelector<HTMLElement>('[data-model-status]');
  const list = modelMenu.querySelector<HTMLUListElement>('[data-model-list]');
  if (!status || !list) return;
  modelsLoaded = true;
  status.textContent = 'Loading available models…';
  try {
    const names = (await loadPublicModels(modelMenu.dataset.apiOrigin)).map(model => model.name);
    for (const name of names) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = modelMenu.querySelector<HTMLAnchorElement>('.dropdown-panel > a')!.href;
      link.textContent = name;
      li.append(link); list.append(li);
    }
    status.textContent = names.length ? 'Sign up to start using these models.' : 'Explore available models in Alveta.';
  } catch {
    modelsLoaded = false;
    status.textContent = 'Models could not be loaded. Explore them in Alveta or reopen this menu to retry.';
  }
});
