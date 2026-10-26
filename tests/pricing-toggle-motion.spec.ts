import { test, expect } from './fixtures/browser';

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`pricing border transfers once without changing selection at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const toggle = page.locator('[data-pricing-toggle]');
    const individual = toggle.locator('label').first();
    const team = toggle.locator('label').last();
    await expect(toggle).toBeVisible();
    await expect(toggle).not.toHaveAttribute('data-border-transfer');
    await toggle.scrollIntoViewIfNeeded();
    await expect(toggle).toHaveAttribute('data-border-transfer', 'running');
    const sample = async (time: number) => toggle.evaluate((node, time) => {
      const animations = node.getAnimations({ subtree: true }).filter(animation => animation instanceof CSSAnimation && animation.animationName.includes('pricing-'));
      for (const animation of animations) { animation.pause(); animation.currentTime = time; }
      const labels = node.querySelectorAll('label');
      return {
        individual: Number(getComputedStyle(labels[0]!, '::before').opacity),
        team: Number(getComputedStyle(labels[1]!, '::before').opacity),
        bridge: Number(getComputedStyle(node, '::after').opacity),
        width: node.getBoundingClientRect().width,
      };
    }, time);
    const start = await sample(300);
    expect(start.team).toBeGreaterThan(.9);
    expect(start.individual).toBe(0);
    const transfer = await sample(900);
    expect(transfer.bridge).toBeGreaterThan(.5);
    const end = await sample(1450);
    expect(end.team).toBe(0);
    expect(end.individual).toBeGreaterThan(.9);
    expect(end.width).toBe(start.width);
    await expect(individual.locator('input')).toBeChecked();
    await expect(team.locator('input')).not.toBeChecked();
    if (width === 1440) await toggle.screenshot({ path: '.work/validation/pricing-toggle-transfer.png' });
    await toggle.evaluate(node => node.getAnimations({ subtree: true }).forEach(animation => animation.play()));
    await expect(toggle).not.toHaveAttribute('data-border-transfer');
    await expect(individual).toHaveCSS('background-color', 'rgb(56, 14, 135)');
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await toggle.scrollIntoViewIfNeeded();
    await expect(toggle).not.toHaveAttribute('data-border-transfer');
  });
}

test('manual plan selection cancels the entrance effect and remains selected', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('[data-pricing-toggle]');
  await expect(toggle).toBeVisible();
  await toggle.scrollIntoViewIfNeeded();
  await expect(toggle).toHaveAttribute('data-border-transfer', 'running');
  const team = toggle.getByRole('radio', { name: 'Team/Organization' });
  await team.check();
  await expect(toggle).not.toHaveAttribute('data-border-transfer');
  await expect(team).toBeChecked();
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await toggle.scrollIntoViewIfNeeded();
  await expect(toggle).not.toHaveAttribute('data-border-transfer');
  await expect(team).toBeChecked();
});

test('reduced motion uses static tabs and can stop an active entrance effect', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const toggle = page.locator('[data-pricing-toggle]');
  await expect(toggle).toBeVisible();
  await toggle.scrollIntoViewIfNeeded();
  await expect(toggle).not.toHaveAttribute('data-border-transfer');
  await expect(toggle.locator('label').first()).toHaveCSS('background-color', 'rgb(56, 14, 135)');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(toggle).toBeVisible();
  await toggle.scrollIntoViewIfNeeded();
  await expect(toggle).toHaveAttribute('data-border-transfer', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(toggle).not.toHaveAttribute('data-border-transfer');
  await expect(toggle.getByRole('radio', { name: 'Individual' })).toBeChecked();
});
