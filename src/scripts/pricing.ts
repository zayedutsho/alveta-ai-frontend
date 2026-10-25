import { loadPackages, loadPublicModels, invalidatePackageCache } from '../lib/public-catalog';
import type { PackageCatalog, PublicModel, PublicPackage, Currency } from '../types/catalog';
import type { PricingContent } from '../types/content';

const root = document.querySelector<HTMLElement>('[data-pricing]');
if (root) initialize(root);

function initialize(root: HTMLElement) {
  const content = JSON.parse(root.dataset.content!) as PricingContent;
  const origin = root.dataset.apiOrigin!;
  const find = <T extends Element = HTMLElement>(selector: string, parent: ParentNode = root) => parent.querySelector<T>(selector)!;
  const clone = (selector: string) => find<HTMLTemplateElement>(selector).content.firstElementChild!.cloneNode(true) as HTMLElement;
  const status = find('[data-pricing-status]');
  const grid = find('[data-plan-grid]');
  const retry = find<HTMLButtonElement>('[data-pricing-retry]');
  const controls = find('[data-controls]');
  const currencyControl = find<HTMLSelectElement>('[data-currency]');
  let catalog: PackageCatalog | undefined;
  let models: PublicModel[] | undefined;
  let modelFailed = false;
  let currency: Currency = 'USD';
  let mode = 'individual';
  let busy = false;
  const seatsBySlug = new Map<string, number>();
  const write = (parent: ParentNode, selector: string, value: string) => { find(selector, parent).textContent = value; };
  const money = (value: number, unit: Currency) => (unit === 'BDT' ? '৳' : '$') + new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);

  function priceFor(pkg: PublicPackage) {
    const prices = mode === 'team' ? pkg.per_seat_price : pkg.price;
    return currency === 'BDT' && prices.bdt !== null
      ? { amount: prices.bdt, currency: 'BDT' as const }
      : { amount: prices.usd, currency: 'USD' as const };
  }

  function render() {
    if (!catalog) return;
    const focusedSeat = document.activeElement?.closest<HTMLElement>('[data-package]')?.dataset.package;
    const teamAvailable = catalog.packages.some(pkg => pkg.is_team_enabled && (pkg.per_seat_price.usd !== null || (currency === 'BDT' && pkg.per_seat_price.bdt !== null)));
    if (mode === 'team' && !teamAvailable) {
      mode = 'individual';
      find<HTMLInputElement>('[name="plan-type"][value="individual"]').checked = true;
    }
    grid.replaceChildren();
    const packages = content.order.flatMap(slug => catalog!.packages.filter(pkg => pkg.slug.toLowerCase() === slug))
      .filter(pkg => mode !== 'team' || (pkg.is_team_enabled && priceFor(pkg).amount !== null));
    status.textContent = packages.length ? '' : content.labels.empty;
    status.hidden = packages.length > 0;
    retry.hidden = packages.length > 0;
    grid.setAttribute('aria-busy', 'false');
    controls.hidden = !catalog.packages.length;
    find('[data-team-option]').hidden = !teamAvailable;
    for (const pkg of packages) {
      const card = clone('[data-plan-template]');
      const popular = pkg.slug.toLowerCase() === content.popular;
      card.classList.toggle('popular', popular);
      card.classList.toggle('subtle', pkg.slug.toLowerCase() === 'pro');
      card.dataset.package = pkg.slug;
      find('[data-popular-label]', card).hidden = !popular;
      write(card, '[data-plan-name]', pkg.name);
      write(card, '[data-plan-description]', pkg.description);
      const selected = priceFor(pkg);
      write(card, '[data-price]', money(selected.amount!, selected.currency));
      write(card, '[data-price-period]', mode === 'team' ? '/seat/mo' : '/mo');
      find('[data-currency-fallback]', card).hidden = currency !== 'BDT' || selected.currency === 'BDT';
      const seatControl = find('[data-seat-control]', card);
      const total = find('[data-team-total]', card);
      seatControl.hidden = total.hidden = mode !== 'team';
      if (mode === 'team') {
        const input = find<HTMLInputElement>('[data-seats]', card);
        input.min = String(pkg.min_team_seats);
        input.value = String(seatsBySlug.get(pkg.slug) ?? pkg.min_team_seats);
        input.setAttribute('aria-label', `${pkg.name} team seats`);
        const update = () => {
          let seats = Number(input.value);
          if (!Number.isSafeInteger(seats) || seats < pkg.min_team_seats || !Number.isFinite(seats * selected.amount!)) seats = pkg.min_team_seats;
          input.value = String(seats);
          seatsBySlug.set(pkg.slug, seats);
          total.textContent = `${money(seats * selected.amount!, selected.currency)}/mo total · minimum ${pkg.min_team_seats} seats`;
        };
        input.addEventListener('change', update); update();
      }
      write(card, '[data-tokens]', pkg.token_value === null ? content.labels.usageUnknown : `Up to ${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(pkg.token_value)} tokens${mode === 'team' ? '/seat' : ''}`);
      find('[data-tokens]', card).setAttribute('title', 'Reference usage estimate; actual usage varies by model.');
      const link = find<HTMLAnchorElement>('.pricing-cta', card);
      const target = new URL(root.dataset.register!);
      target.searchParams.set('package', pkg.slug);
      if (mode === 'team') target.searchParams.set('team', '1');
      link.href = target.href;
      link.setAttribute('aria-label', `${content.ctaLabel} — ${pkg.name}${mode === 'team' ? ' team' : ''}`);

      const accessibleModels = models?.filter(model => pkg.model_access.includes(model.model_id)) ?? [];
      const allIncluded = models && models.length > 0 && accessibleModels.length === models.length;
      write(card, '[data-model-count]', allIncluded ? 'All Models Included' : `${pkg.model_access.length} Models`);
      write(card, '[data-model-status]', modelFailed ? content.labels.modelsError : !models ? 'Loading model names…' : accessibleModels.length < pkg.model_access.length ? content.labels.partialModels : !accessibleModels.length ? content.labels.noModels : '');
      accessibleModels.forEach((model, index) => {
        const row = clone('[data-model-template]');
        write(row, '[data-model-name]', model.name);
        const provider = model.provider.toLowerCase();
        const icon = root.querySelector<HTMLTemplateElement>(`[data-provider-icon="${provider === 'anthropic' && popular ? 'anthropic-popular' : ['openai', 'anthropic', 'google'].includes(provider) ? provider : 'unknown'}"]`);
        if (icon) find('[data-model-icon]', row).append(icon.content.cloneNode(true));
        else find('[data-model-icon]', row).hidden = true;
        find(index < 3 ? '[data-model-list]' : '[data-extra-models]', card).append(row);
      });
      const more = find<HTMLDetailsElement>('[data-more-models]', card);
      more.hidden = accessibleModels.length <= 3;
      write(card, '[data-more-label]', `${Math.max(0, accessibleModels.length - 3)} More`);
      const rows = content.features.map(feature => ({ ...feature,
        available: ['ai_chat', 'topup', 'unlimited_usage', 'support'].includes(feature.key) || pkg.features[feature.key] === true,
        label: feature.key === 'support' && pkg.features.support_tier === 'priority' ? 'Priority Support' : feature.label,
      })).sort((a, b) => Number(b.available) - Number(a.available));
      for (const feature of rows) {
        const row = clone('[data-feature-template]');
        row.classList.toggle('unavailable', !feature.available);
        row.dataset.feature = feature.key;
        write(row, '[data-feature-label]', feature.label);
        write(row, '[data-feature-availability]', feature.available ? 'Included' : 'Not included');
        find('[data-plan-features]', card).append(row);
      }
      grid.append(card);
      if (focusedSeat === pkg.slug && mode === 'team') find<HTMLInputElement>('[data-seats]', card).focus();
    }
  }

  async function load() {
    if (busy) return;
    busy = true;
    status.hidden = false;
    status.textContent = content.labels.loading;
    retry.hidden = true;
    grid.setAttribute('aria-busy', 'true');
    try {
      catalog = await loadPackages(origin);
      currency = catalog.detected_currency;
      currencyControl.value = currency;
      render();
    } catch {
      grid.replaceChildren();
      grid.setAttribute('aria-busy', 'false');
      status.textContent = content.labels.error;
      retry.hidden = false;
      controls.hidden = true;
    } finally { busy = false; }
  }
  currencyControl.addEventListener('change', () => { currency = currencyControl.value as Currency; render(); });
  root.querySelectorAll<HTMLInputElement>('[name="plan-type"]').forEach(input => input.addEventListener('change', () => {
    mode = input.value; render();
    root.querySelectorAll<HTMLLabelElement>('.toggle-option').forEach(label => {
      const radio = label.querySelector<HTMLInputElement>('input[type="radio"]');
      if (radio?.checked) label.setAttribute('data-checked', ''); else label.removeAttribute('data-checked');
    });
  }));
  retry.addEventListener('click', () => { invalidatePackageCache(); void load(); });
  void load();
  void loadPublicModels(origin).then(result => { models = result; render(); }).catch(() => { modelFailed = true; render(); });
}
