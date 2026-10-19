import { test, expect } from '@playwright/test';

for (const width of [320, 430, 768, 1024, 1440, 1920]) {
  test(`customer logos preserve geometry and load at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const section = page.getByRole('region', { name: 'Customer logos' });
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('.logo-row')).toHaveCount(2);
    await expect(section.locator('.logo-group:not([data-clone]) .logo-tile')).toHaveCount(17);
    const result = await section.evaluate(el => ({
      broken: [...el.querySelectorAll('img')].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
      sizes: [...el.querySelectorAll('.logo-group:not([data-clone]) .logo-tile')].map(tile => { const r = tile.getBoundingClientRect(); return [r.width, r.height]; }),
      centered: [...el.querySelectorAll('.logo-group:not([data-clone]) .logo-tile')].every(tile => {
        const box = tile.getBoundingClientRect();
        const art = tile.querySelector('img')!.getBoundingClientRect();
        return Math.abs(box.left + box.width / 2 - art.left - art.width / 2) < .1
          && Math.abs(box.top + box.height / 2 - art.top - art.height / 2) < .1;
      }),
      overflow: document.documentElement.scrollWidth > innerWidth,
      top: el.getBoundingClientRect().top + scrollY,
      firstTileLeft: el.querySelector('.logo-tile')!.getBoundingClientRect().left,
    }));
    expect(result.broken).toEqual([]); expect(result.overflow).toBe(false);
    expect(result.centered).toBe(true);
    for (const size of result.sizes) expect(size).toEqual(width < 768 ? [80, 36] : [186, 88]);
    if (width === 1440) { expect(result.top).toBe(925); expect(result.firstTileLeft).toBe(-108); }
    if (width === 430) expect(result.top).toBeCloseTo(605, 0);
    if ([430, 1440].includes(width)) await section.screenshot({ path: `.work/validation/m4-logos-${width}.png` });
  });
}

for (const width of [320, 430, 768, 1440, 1920]) {
  test(`logo marquee loops and pauses at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/');
    const section = page.getByRole('region', { name: 'Customer logos' });
    await section.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const tracks = section.locator('.logo-track');
    const loops = await tracks.evaluateAll(elements => elements.map(el => {
      const animation = el.getAnimations()[0];
      if (!animation) throw new Error('Missing marquee animation');
      const duration = Number(animation.effect!.getTiming().duration);
      animation.currentTime = 0;
      const start = el.getBoundingClientRect().left;
      animation.currentTime = duration / 2;
      const midpoint = el.getBoundingClientRect().left;
      const groups = [...el.children].map(group => group.getBoundingClientRect());
      if (!groups[0] || !groups[1]) throw new Error('Missing loop copies');
      return { delta: midpoint - start, cycle: groups[0].width,
        gap: groups[1].left - groups[0].right,
        coverage: el.getBoundingClientRect().right >= innerWidth,
        state: getComputedStyle(el).animationPlayState };
    }));
    if (!loops[0] || !loops[1]) throw new Error('Missing logo rows');
    expect(loops[0].delta).toBeCloseTo(-loops[0].cycle / 2, 1);
    expect(loops[1].delta).toBeCloseTo(loops[1].cycle / 2, 1);
    for (const loop of loops) {
      expect(loop.gap).toBeCloseTo(0, 1);
      expect(loop.coverage).toBe(true);
      expect(loop.state).toBe('running');
    }
    await section.hover();
    await expect(tracks.first()).toHaveCSS('animation-play-state', 'paused');
    await expect.poll(() => tracks.first().evaluate(el => el.getAnimations()[0]?.playState)).toBe('paused');
    await page.mouse.move(0, 0);
    const toggle = section.locator('[data-marquee-toggle]');
    await toggle.focus();
    await expect(tracks.first()).toHaveCSS('animation-play-state', 'paused');
    await toggle.press('Enter');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.evaluate(el => el.blur());
    await expect(tracks.first()).toHaveCSS('animation-play-state', 'paused');
    await toggle.focus();
    await toggle.press('Enter');
    await toggle.evaluate(el => el.blur());
    await expect(tracks.first()).toHaveCSS('animation-play-state', 'running');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    if ([430, 1440].includes(width)) await section.screenshot({ path: `.work/validation/logo-marquee-${width}.png`, animations: 'disabled' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(tracks.first()).toHaveCSS('animation-name', 'none');
    await expect(toggle).toBeHidden();
    await expect(section.locator('[data-clone]').first()).toBeHidden();
  });
}
