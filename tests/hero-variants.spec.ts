import { test, expect } from './fixtures/browser';

const variants = [
  { id: 'chat', label: 'AI chat', assistant: 'General Assistance', placeholder: 'Ask me anything', compare: true, voice: false, ratios: false },
  { id: 'image', label: 'AI images', assistant: 'Image Generate', placeholder: 'Describe the image you want to create', compare: false, voice: false, ratios: true },
  { id: 'code', label: 'AI coding', assistant: 'Code Assistant', placeholder: 'Describe what you want to build, fix, or explain...', compare: true, voice: false, ratios: false },
  { id: 'voice', label: 'AI voice tools', assistant: 'Code Assistant', placeholder: 'Type or paste your script here...', compare: true, voice: true, ratios: false },
  { id: 'video', label: 'AI video tools', assistant: 'Code Assistant', placeholder: 'Type or paste your script here...', compare: true, voice: true, ratios: true },
];

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`hero switches all Figma variants without shifting or overflowing at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const composer = page.locator('[data-composer]');
    const workspace = page.locator('[data-hero-workspace]');
    const initial = await composer.boundingBox();
    const modePositions = await workspace.locator('.mode').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().x));
    for (const variant of variants) {
      const button = page.getByRole('button', { name: variant.label, exact: true });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(workspace.locator('[data-hero-mode][aria-pressed="true"]')).toHaveCount(1);
      await expect(composer).toHaveAttribute('data-mode', variant.id);
      await expect(composer.locator('[data-assistant-label]')).toHaveText(variant.assistant);
      await expect(composer.locator('textarea')).toHaveAttribute('placeholder', variant.placeholder);
      await expect(composer.locator('.compare')).toBeVisible({ visible: variant.compare });
      await expect(composer.locator('.voice-picker')).toBeVisible({ visible: variant.voice });
      await expect(composer.locator('.aspect-options')).toBeVisible({ visible: variant.ratios });
      await expect(workspace.locator('.mode-pointer:visible')).toHaveCount(1);
      const geometry = await workspace.evaluate(async node => {
        const images = [...node.querySelectorAll<HTMLImageElement>('img')].filter(image => image.getClientRects().length && getComputedStyle(image).display !== 'none');
        await Promise.all(images.map(image => image.decode()));
        return {
          broken: images.filter(image => !image.naturalWidth).length,
          overflow: document.documentElement.scrollWidth > innerWidth,
          outside: [...node.querySelectorAll<HTMLElement>('.composer a, .composer button, textarea')].filter(control => control.getClientRects().length).some(control => {
            const r = control.getBoundingClientRect(); return r.left < 0 || r.right > innerWidth;
          }),
          positions: [...node.querySelectorAll('.mode')].map(button => button.getBoundingClientRect().x),
        };
      });
      expect(geometry).toMatchObject({ broken: 0, overflow: false, outside: false });
      expect(geometry.positions).toEqual(modePositions);
      expect((await composer.boundingBox())!.height).toBeCloseTo(initial!.height, 1);
      if ([1440, 390].includes(width)) await workspace.screenshot({ path: `.work/validation/hero-variant-${variant.id}-${width}.png`, animations: 'disabled' });
    }
    expect(errors).toEqual([]);
  });
}

test('hero keeps drafts, compare state, aspect choices, and signup behavior', async ({ page }) => {
  await page.goto('/');
  const composer = page.locator('[data-composer]');
  const prompt = page.getByLabel('Your prompt', { exact: true });
  await prompt.fill('My chat draft');
  await page.getByRole('checkbox', { name: 'Compare AI model responses' }).check();
  await page.getByRole('button', { name: 'AI images', exact: true }).click();
  await expect(prompt).toHaveValue('');
  await prompt.fill('My image draft');
  await composer.locator('[data-aspect="16:9"]').click();
  await expect(composer.locator('[data-aspect="16:9"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composer.locator('.image-model-name')).toHaveText('Nano Banna');
  await expect(composer.locator('.provider.gemini')).toBeVisible();
  await expect(composer.locator('.provider.openai')).toBeHidden();
  await page.getByRole('button', { name: 'AI chat', exact: true }).click();
  await expect(prompt).toHaveValue('My chat draft');
  await expect(page.getByRole('checkbox', { name: 'Compare AI model responses' })).toBeChecked();
  await page.getByRole('button', { name: 'AI images', exact: true }).click();
  await expect(prompt).toHaveValue('My image draft');
  await expect(composer.locator('[data-aspect="16:9"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composer).toHaveAttribute('action', 'https://app.alveta.ai/register');
  expect(await composer.evaluate(form => [...new FormData(form as HTMLFormElement).entries()])).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  for (const link of await composer.locator('a:visible').all()) await expect(link).toHaveAttribute('href', 'https://app.alveta.ai/register');
});

test('hero supports keyboard switching, rapid switching, and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const chat = page.getByRole('button', { name: 'AI chat', exact: true });
  await chat.focus();
  await chat.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'AI images', exact: true })).toBeFocused();
  await expect(page.locator('[data-composer]')).toHaveAttribute('data-mode', 'image');
  expect(await page.locator('.prompt-panel').evaluate(node => node.getAnimations().length)).toBe(0);
  await page.keyboard.press('End');
  await expect(page.locator('[data-composer]')).toHaveAttribute('data-mode', 'video');
  await page.keyboard.press('Home');
  await expect(chat).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => {
    for (const id of ['image', 'code', 'voice', 'video']) document.querySelector<HTMLButtonElement>(`[data-hero-mode="${id}"]`)!.click();
  });
  await expect(page.locator('[data-composer]')).toHaveAttribute('data-mode', 'video');
  expect(await page.locator('.prompt-panel').evaluate(node => node.getAnimations().length)).toBeLessThanOrEqual(1);
});
