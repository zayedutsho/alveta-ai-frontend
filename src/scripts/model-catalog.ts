import { loadPublicModels } from '../lib/public-catalog';
import { modelCard, providerInfo } from '../lib/model-presentation';
import type { PublicModel } from '../types/catalog';

const root = document.querySelector<HTMLElement>('[data-model-catalog]');
if (root) {
  const grid = root.querySelector<HTMLElement>('[data-catalog-grid]')!;
  const status = root.querySelector<HTMLElement>('[data-catalog-status]')!;
  const count = root.querySelector<HTMLElement>('[data-catalog-count]')!;
  const search = root.querySelector<HTMLInputElement>('[data-catalog-search]')!;
  const filters = root.querySelector<HTMLElement>('[data-provider-filters]')!;
  const retry = root.querySelector<HTMLButtonElement>('[data-catalog-retry]')!;
  let models: PublicModel[] = [], selected = 'All models';
  let loaded = false;
  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = models.filter(model => (selected === 'All models' || providerInfo(model.provider).label === selected)
      && `${model.name} ${model.provider} ${providerInfo(model.provider).label}`.toLowerCase().includes(query));
    grid.replaceChildren(...visible.map(model => {
      const card = modelCard(model); card.href = root!.dataset.register!; return card;
    }));
    grid.scrollTop = 0;
    count.textContent = `${visible.length} of ${models.length} models`;
    status.textContent = visible.length ? '' : models.length ? 'No models match your search. Try another model or provider.' : 'No models are available right now. Please check back soon.';
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.textContent === selected)));
  }
  async function load() {
    loaded = true;
    retry.hidden = true; grid.setAttribute('aria-busy', 'true'); status.textContent = 'Loading available models…';
    try {
      models = await loadPublicModels(root!.dataset.apiOrigin!);
      filters.replaceChildren(...['All models', ...new Set(models.map(model => providerInfo(model.provider).label))].map(provider => {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = provider;
        button.addEventListener('click', () => { selected = provider; render(); }); return button;
      }));
      render();
    } catch { loaded = false; status.textContent = 'Models could not be loaded. Please try again.'; retry.hidden = false; }
    finally { grid.setAttribute('aria-busy', 'false'); }
  }
  search.addEventListener('input', render);
  retry.addEventListener('click', load);
  const menu = root.closest('details');
  menu?.addEventListener('toggle', () => { if (menu.open && !loaded) void load(); });
  if (!menu || menu.open) void load();
}
