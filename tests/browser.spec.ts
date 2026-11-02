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

test('twelve frozen assemblies retain upright orientation and stay separated through a full revolution', async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.locator('.hero-art').scrollIntoViewIfNeeded();
    await expect(page.locator('.hero-art')).toHaveClass(/motion-ready/);
    await expect(page.locator('.hero-art img')).toHaveCount(12);
    await expect(page.locator('.orbital-ring-outer img')).toHaveCount(3);
    await expect(page.locator('.orbital-ring-inner img')).toHaveCount(8);
    await expect(page.locator('.hero-art img[src*="/brand/"]')).toHaveCount(0);
    const sample = async (time: number) =>
      page.locator('.orbital-system').evaluate((scene, t) => {
        scene.querySelectorAll('.orbit-carrier, .orbit-counter').forEach((el) =>
          el.getAnimations().forEach((a) => {
            a.pause();
            a.currentTime = t;
          }),
        );
        const bounds = scene.getBoundingClientRect();
        const boxes = [...scene.querySelectorAll('img')].map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.x - bounds.x,
            y: r.y - bounds.y,
            w: r.width,
            h: r.height,
          };
        });
        const upright = [...scene.querySelectorAll('.orbit-counter')].every(
          (el) => {
            const carrier = el.closest('.orbit-carrier')!;
            const combined = new DOMMatrix(
              getComputedStyle(carrier).transform,
            ).multiply(new DOMMatrix(getComputedStyle(el).transform));
            return (
              Math.abs(combined.a - 1) < 0.001 &&
              Math.abs(combined.b) < 0.001 &&
              Math.abs(combined.c) < 0.001 &&
              Math.abs(combined.d - 1) < 0.001
            );
          },
        );
        const timing = [
          ...scene.querySelectorAll('.orbit-carrier,.orbit-counter'),
        ].every((el) => {
          const style = getComputedStyle(el);
          return (
            style.animationDuration === '100s' &&
            style.animationTimingFunction === 'linear'
          );
        });
        return { boxes, upright, timing, size: bounds.width };
      }, time);
    const start = await sample(0);
    const quarter = await sample(25000);
    expect(quarter.boxes[1].x).toBeGreaterThan(
      start.boxes[1].x + start.size * 0.3,
    );
    expect(quarter.boxes[4].x).toBeLessThan(
      start.boxes[4].x - start.size * 0.2,
    );
    for (const time of [0, 12500, 25000, 50000, 75000, 99999, 100000]) {
      const state = await sample(time);
      expect(state.upright).toBe(true);
      expect(state.timing).toBe(true);
      for (const box of state.boxes) {
        expect(box.x).toBeGreaterThanOrEqual(-0.5);
        expect(box.y).toBeGreaterThanOrEqual(-0.5);
        expect(box.x + box.w).toBeLessThanOrEqual(state.size + 0.5);
        expect(box.y + box.h).toBeLessThanOrEqual(state.size + 0.5);
      }
      for (let i = 0; i < state.boxes.length; i++)
        for (let j = i + 1; j < state.boxes.length; j++) {
          const a = state.boxes[i],
            b = state.boxes[j];
          expect(
            a.x + a.w <= b.x ||
              b.x + b.w <= a.x ||
              a.y + a.h <= b.y ||
              b.y + b.h <= a.y,
          ).toBe(true);
        }
    }
    const loop = await sample(100000);
    expect(loop.boxes[1].x).toBeCloseTo(start.boxes[1].x, 1);
    expect(loop.boxes[1].y).toBeCloseTo(start.boxes[1].y, 1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }
});

test('orbit pauses offscreen and in a hidden tab, and user pause survives visibility changes', async ({
  page,
}) => {
  await page.goto('/');
  const art = page.locator('.hero-art');
  await expect(art).toHaveClass(/is-moving/);
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await expect(art).not.toHaveClass(/is-moving/);
  await art.scrollIntoViewIfNeeded();
  await expect(art).toHaveClass(/is-moving/);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(art).not.toHaveClass(/is-moving/);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(art).toHaveClass(/is-moving/);
  await page.getByRole('button', { name: 'Pause movement' }).click();
  const positions = await page
    .locator('.orbit-carrier,.orbit-counter')
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
  await page.waitForTimeout(150);
  expect(
    await page
      .locator('.orbit-carrier,.orbit-counter')
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform)),
  ).toEqual(positions);
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await art.scrollIntoViewIfNeeded();
  await expect(art).not.toHaveClass(/is-moving/);
  await page.getByRole('button', { name: 'Replay movement' }).click();
  await expect(art).toHaveClass(/is-moving/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page
      .locator('.orbit-carrier,.orbit-counter')
      .evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).animationName === 'none'),
      ),
  ).toBe(true);
  await expect(page.locator('.hero-art img')).toHaveCount(12);
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
