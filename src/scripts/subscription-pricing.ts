import { loadPackages } from '../lib/public-catalog';

const section = document.querySelector<HTMLElement>('[data-subscription-comparison]');

if (section) {
  const origin = section.dataset.apiOrigin!;
  const providerUsd = 20;
  const savingsUsd = 120;
  const write = (selector: string, value: string) => {
    section.querySelectorAll<HTMLElement>(selector).forEach(node => { node.textContent = value; });
  };

  void loadPackages(origin).then(catalog => {
    if (catalog.detected_currency === 'BDT') return;
    const preferred = catalog.packages.find(pkg => pkg.slug.toLowerCase() === 'play')
      ?? catalog.packages.reduce((lowest, pkg) => pkg.price.usd < lowest.price.usd ? pkg : lowest);
    const offerUsd = Math.ceil(preferred.price.usd);

    section.querySelectorAll<HTMLElement>('[lang="bn"]').forEach(node => {
      node.lang = 'en';
    });
    write('[data-provider-price]', `$${providerUsd}`);
    write('[data-provider-period]', '/mo');
    write('[data-offer-prefix]', 'From');
    write('[data-offer-price]', `$${offerUsd}`);
    write('[data-offer-suffix]', '');
    write('[data-offer-savings]', `Save $${savingsUsd}`);
  }).catch(() => {
    // Keep the server-rendered BDT copy when visitor currency cannot be detected.
  });
}
