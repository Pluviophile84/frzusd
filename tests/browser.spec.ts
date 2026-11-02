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
    await expect(page.getByRole('link', { name: 'Buy $FUSD' })).toHaveCount(0);
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
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'The idea', exact: true }),
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
      .first()
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
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'The idea', exact: true }),
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
      .first()
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
    page.getByRole('link', { name: 'Buy $FUSD' }).first(),
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

for (const selector of [
  'header .brand',
  'footer .brand',
  'footer [data-scroll-top].text-link',
]) {
  test(`smooth return to top without reload: ${selector}`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.documentElement.dataset.navigationMarker = 'retained';
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'instant',
      });
    });
    const link = page.locator(selector);
    if (selector.startsWith('header')) await expect(link).toBeVisible();
    await link.click();
    // A smooth return has intermediate scroll positions instead of a reload/jump.
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect(page.locator('html')).toHaveAttribute(
      'data-navigation-marker',
      'retained',
    );
  });
}
test('reduced-motion return is immediate and branding is consistent', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('header .brand')).toHaveText('Frozen USD');
  await expect(page.locator('.hero-copy')).toContainText('$FUSD');
  await expect(page.locator('body')).not.toContainText('$FRZUSD');
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  );
  await page.locator('footer .text-link[data-scroll-top]').click();
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('tokens circulate with depth, pause in place and retain a static reduced-motion scene', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.hero-art')).toHaveClass(/motion-ready/);
  const token = page.locator('.orbit-token').first();
  const sampleAt = async (time: number) =>
    token.evaluate((el, t) => {
      const animation = el.getAnimations()[0];
      animation.pause();
      animation.currentTime = t;
      const box = el.getBoundingClientRect();
      return {
        x: box.x,
        y: box.y,
        distance: getComputedStyle(el).offsetDistance,
      };
    }, time);
  const start = await sampleAt(0);
  const quarter = await sampleAt(5000);
  expect(Math.abs(quarter.x - start.x)).toBeGreaterThan(60);
  expect(Math.abs(quarter.y - start.y)).toBeGreaterThan(30);
  const depths = await page.locator('.token-depth').evaluateAll((els) =>
    els.map((el) => {
      const a = el.getAnimations()[0];
      a.pause();
      a.currentTime = 0;
      return new DOMMatrix(getComputedStyle(el).transform).a;
    }),
  );
  expect(Math.max(...depths) - Math.min(...depths)).toBeGreaterThan(0.15);
  await page.getByRole('button', { name: 'Pause movement' }).click();
  const paused = await token.evaluate(
    (el) => getComputedStyle(el).offsetDistance,
  );
  await page.waitForTimeout(200);
  expect(
    await token.evaluate((el) => getComputedStyle(el).offsetDistance),
  ).toBe(paused);
  expect(
    await page
      .locator('.orbit-token, .token-depth')
      .evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).animationPlayState === 'paused'),
      ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const positions = await page
    .locator('.orbit-token')
    .evaluateAll((els) =>
      els.slice(0, 4).map((el) => getComputedStyle(el).offsetDistance),
    );
  expect(new Set(positions).size).toBe(4);
  await expect(page.locator('.orbit-canvas')).toBeVisible();
});

test('reserve proposition, section order, mobile anchor and FAQ preserve the parody distinction', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(
    await page.locator('.hero').evaluate((el) => el.nextElementSibling?.id),
  ).toBe('reserves');
  const claim = page.locator('.hero-reserve-claim a');
  await expect(claim).toHaveText(
    'Pegged 1:1 to an ice cube. 100% backed by cold, hard reserves.',
  );
  await expect(claim).toHaveAttribute('href', '#reserves');
  await claim.click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.round(
          document.getElementById('reserves')!.getBoundingClientRect().top,
        ),
      ),
    )
    .toBe(85);
  await expect(page.locator('#reserves h2')).toHaveText(
    '100% backed by cold, hard reserves.',
  );
  await expect(page.locator('.reserve-value')).toHaveText([
    '1:1',
    '100%',
    'Siberia',
  ]);
  await expect(page.locator('#reserves')).toContainText(
    'Strategic Ice Reserve in Siberia',
  );
  const faq = page.locator('#faq details').filter({
    has: page.locator('summary', { hasText: 'What is FUSD pegged to?' }),
  });
  await faq.locator('summary').click();
  await expect(faq.locator('p')).toHaveText([
    'One FUSD. One ice cube. We standardized the cube because ‘some ice’ did not look institutional enough.',
    'This is our parody peg. FUSD is a memecoin with no dollar peg or redemption promise.',
  ]);
  expect(
    await faq.evaluate(
      (el) => el.nextElementSibling?.querySelector('summary')?.textContent,
    ),
  ).toContain('What backs it?');
  await expect(page.locator('#token')).not.toContainText('Siberia');
  await expect(page.locator('footer .disclaimer')).toContainText(
    'No dollar peg or redemption.',
  );
  await page.getByRole('button', { name: 'Menu' }).click();
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(nav.getByRole('link')).toHaveText([
    'The idea',
    'Reserves',
    'How it works',
    'The cold facts',
    'Memes',
  ]);
  await nav.getByRole('link', { name: 'Reserves', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.round(
          document.getElementById('reserves')!.getBoundingClientRect().top,
        ),
      ),
    )
    .toBe(85);
  await expect(
    page
      .getByRole('navigation', { name: 'Footer navigation' })
      .getByRole('link'),
  ).toHaveText([
    'The idea',
    'Reserves',
    'How it works',
    'The cold facts',
    'Memes',
  ]);
});

test('expanded desktop navigation fits intermediate widths', async ({
  page,
}) => {
  for (const width of [901, 1024, 1100]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const boxes = await Promise.all(
      ['header .brand', '#navigation', '.header-action'].map((s) =>
        page.locator(s).boundingBox(),
      ),
    );
    const [brand, nav, action] = boxes;
    expect(brand!.x + brand!.width).toBeLessThan(nav!.x);
    expect(nav!.x + nav!.width).toBeLessThan(action!.x);
    expect(action!.x + action!.width).toBeLessThanOrEqual(width);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await expect(
      page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Reserves', exact: true }),
    ).toBeVisible();
  }
});
