import { test, expect } from '@playwright/test';

// ── Home page ─────────────────────────────────────────────────────────────────

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/FILMCAT/);
  });

  test('shows the FILMCAT logo', async ({ page }) => {
    await expect(page.locator('.logo-text')).toBeVisible();
    await expect(page.locator('.logo-text')).toContainText('FILMCAT');
  });

  test('shows the "En Cartellera" section', async ({ page }) => {
    await expect(page.locator('#cartellera-h')).toBeVisible();
    await expect(page.locator('#cartellera-h')).toContainText('En Cartellera');
  });

  test('renders at least one film card', async ({ page }) => {
    const cards = page.locator('#mainCarousel .card');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('film cards have accessible labels', async ({ page }) => {
    const card = page.locator('#mainCarousel .card').first();
    await expect(card).toHaveAttribute('aria-label');
    const label = await card.getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label!.length).toBeGreaterThan(3);
  });

  test('shows the "Cinemes" section', async ({ page }) => {
    await expect(page.locator('#cinemes-h')).toBeVisible();
  });

  test('has skip-to-content link', async ({ page }) => {
    const skip = page.locator('.skip-link');
    await expect(skip).toBeAttached();
  });

  test('version filter buttons are present', async ({ page }) => {
    const filterBar = page.locator('[data-filter-type="version"]');
    await expect(filterBar).toBeVisible();
    const buttons = filterBar.locator('.filter-btn');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

// ── Province filter ───────────────────────────────────────────────────────────

test.describe('Province filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"Totes" button is active by default', async ({ page }) => {
    const provinceBar = page.locator('[data-filter-type="province"]');
    // Province bar only renders when there are >1 provinces
    const exists = await provinceBar.count();
    if (exists === 0) return; // single-province week — skip

    const allBtn = provinceBar.locator('[data-province-filter="all"]');
    await expect(allBtn).toHaveClass(/active/);
    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('clicking a province button updates aria-pressed', async ({ page }) => {
    const provinceBar = page.locator('[data-filter-type="province"]');
    const exists = await provinceBar.count();
    if (exists === 0) return;

    const buttons = provinceBar.locator('.filter-btn');
    const count = await buttons.count();
    if (count < 2) return;

    const secondBtn = buttons.nth(1);
    await secondBtn.click();
    await expect(secondBtn).toHaveAttribute('aria-pressed', 'true');

    const allBtn = provinceBar.locator('[data-province-filter="all"]');
    await expect(allBtn).toHaveAttribute('aria-pressed', 'false');
  });
});

// ── Navigation: card → film page ─────────────────────────────────────────────

test.describe('Film detail page', () => {
  test('navigating to a film card goes to its detail page', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('#mainCarousel .card').first();
    await firstCard.click();

    // Should be on /films/<slug>
    await expect(page).toHaveURL(/\/films\/.+/);
  });

  test('film detail page shows title and back link', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('#mainCarousel .card').first();
    await firstCard.click();

    // h1 with film title
    await expect(page.locator('.film-title')).toBeVisible();
    // Back link
    await expect(page.locator('#backLink')).toBeVisible();
  });

  test('film detail page has version badge', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('#mainCarousel .card').first();
    await firstCard.click();

    await expect(page.locator('.film-tags .badge')).toBeVisible();
  });

  test('back link returns to home page', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('#mainCarousel .card').first();
    await firstCard.click();

    await page.locator('#backLink').click();
    await expect(page).toHaveURL(/\/(#.*)?$/);
  });

  test('non-existent slug redirects to home', async ({ page }) => {
    await page.goto('/films/this-film-does-not-exist-xyz');
    await expect(page).toHaveURL('/');
  });
});

// ── Mobile navigation ─────────────────────────────────────────────────────────

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger button is visible on mobile', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.locator('#hamburgerBtn');
    await expect(hamburger).toBeVisible();
  });

  test('mobile nav opens and closes with hamburger', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.locator('#hamburgerBtn');
    const mobileNav = page.locator('#mobile-nav');

    // Initially closed
    await expect(mobileNav).not.toHaveClass(/open/);

    // Open
    await hamburger.click();
    await expect(mobileNav).toHaveClass(/open/);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    // Close
    await hamburger.click();
    await expect(mobileNav).not.toHaveClass(/open/);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });
});

// ── Accessibility ─────────────────────────────────────────────────────────────

test.describe('Accessibility', () => {
  test('home page has lang="ca" on <html>', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('ca');
  });

  test('home page has a <main> with id="main-content"', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#main-content')).toBeAttached();
  });

  test('film cards have role="listitem"', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('#mainCarousel .card').first();
    await expect(card).toHaveAttribute('role', 'listitem');
  });
});
