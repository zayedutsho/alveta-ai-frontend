import { test, expect } from '@playwright/test';

for (const width of [320, 430, 768, 1024, 1440, 1920]) {
  test(`customer logos preserve geometry and load at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/');
    const section = page.getByRole('region', { name: 'Customer logos' });
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('.logo-row')).toHaveCount(2);
    await expect(section.locator('.logo-tile')).toHaveCount(17);
    const result = await section.evaluate(el => ({
      broken: [...el.querySelectorAll('img')].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
      sizes: [...el.querySelectorAll('.logo-tile')].map(tile => { const r = tile.getBoundingClientRect(); return [r.width, r.height]; }),
      overflow: document.documentElement.scrollWidth > innerWidth,
      top: el.getBoundingClientRect().top + scrollY,
      firstTileLeft: el.querySelector('.logo-tile')!.getBoundingClientRect().left,
    }));
    expect(result.broken).toEqual([]); expect(result.overflow).toBe(false);
    for (const size of result.sizes) expect(size).toEqual(width < 768 ? [80, 36] : [186, 88]);
    if (width === 1440) { expect(result.top).toBe(925); expect(result.firstTileLeft).toBe(-108); }
    if (width === 430) expect(result.top).toBeCloseTo(605, 0);
    if ([430, 1440].includes(width)) await section.screenshot({ path: `.work/validation/m4-logos-${width}.png` });
  });
}
