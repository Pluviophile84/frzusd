import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const [width, height] of [
  [390, 844],
  [768, 1024],
  [1440, 1000],
]) {
  test(`production page at ${width}px: links, assets, accessibility, layout`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveText(
      'The dollar that trades frozen.',
    );
    await expect(page.locator('[data-copy]')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Buy $FRZUSD' })).toHaveCount(
      0,
    );
    await expect(page.getByRole('link', { name: 'Follow on X' })).toHaveCount(
      0,
    );
    expect(
      await page.locator('meta[name="robots"]').getAttribute('content'),
    ).toBe('noindex, nofollow');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator('#memes').scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images].map((i) => {
          i.loading = 'eager';
          return i.decode();
        }),
      );
    });
    expect(
      await page.evaluate(() =>
        [...document.images].every((i) => i.complete && i.naturalWidth > 0),
      ),
    ).toBe(true);
    await page.evaluate(() => scrollTo(0, 0));
    for (const href of await page
      .locator('a')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')!))) {
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
      if (href.startsWith('#') || href.startsWith('/#'))
        expect(await page.locator(href.slice(href.indexOf('#'))).count()).toBe(
          1,
        );
    }
    for (const href of await page
      .locator('a[download]')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')!))) {
      const r = await request.get(href);
      expect(r.ok()).toBe(true);
      expect(await r.text()).toContain('<svg');
    }
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(scan.violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  });
}
test('mobile menu keyboard, Escape focus, FAQ and pause', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'The idea', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  const faq = page.locator('#faq summary').first();
  await faq.focus();
  await page.keyboard.press('Enter');
  await expect(faq.locator('..')).toHaveAttribute('open', '');
  const pause = page.getByRole('button', { name: 'Pause movement' });
  await pause.click();
  await expect(page.locator('.hero-art')).not.toHaveClass(/is-moving/);
  await expect(
    page.getByRole('button', { name: 'Replay movement' }),
  ).toHaveAttribute('aria-pressed', 'true');
});
test('reduced motion is still and respects changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(
    await page
      .locator('.moving-object')
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await expect(
    page.getByRole('button', { name: 'Replay movement' }),
  ).toBeVisible();
});
test('no JavaScript retains navigation, FAQ and complete content', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321');
  await expect(
    page.getByRole('link', { name: 'The idea', exact: true }),
  ).toBeVisible();
  await page.locator('#faq summary').first().click();
  await expect(page.locator('#faq details').first()).toHaveAttribute(
    'open',
    '',
  );
  await expect(page.locator('.motion-toggle')).toBeHidden();
  expect(
    await page
      .locator('.moving-object')
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await context.close();
});
test('404 is a real not-found response', async ({ page }) => {
  const response = await page.goto('/missing-dollar');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('This dollar moved.');
  await expect(
    page.getByRole('link', { name: 'Back to Frozen USD', exact: true }),
  ).toHaveAttribute('href', '/');
});
test('live fixture enables genuine controls and clipboard success', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('http://127.0.0.1:4322');
  await expect(
    page.getByRole('link', { name: 'Buy $FRZUSD' }).first(),
  ).toHaveAttribute('href', /^https:\/\/pump.fun\/coin\//);
  await expect(
    page.getByRole('link', { name: 'Explorer' }).first(),
  ).toHaveAttribute('href', /^https:\/\/solscan.io/);
  await page.getByRole('button', { name: 'Copy address' }).first().click();
  await expect(page.getByRole('status').first()).toHaveText('Address copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'So11111111111111111111111111111111111111112',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'index, follow',
  );
});
test('clipboard failure is announced with manual fallback', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('denied')) },
    }),
  );
  await page.goto('http://127.0.0.1:4322');
  await page.getByRole('button', { name: 'Copy address' }).first().click();
  await expect(page.getByRole('status').first()).toContainText(
    'Could not copy. Select and copy',
  );
  await expect(page.locator('code').first()).toHaveText(
    'So11111111111111111111111111111111111111112',
  );
});
