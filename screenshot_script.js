const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
}

const status = {
  success: [],
  failed: []
};

function reportSuccess(filename) {
  status.success.push(filename);
}

function reportError(filename, error) {
  status.failed.push({ filename, error: error.message });
  console.error(`Failed to create ${filename}:`, error.message);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  console.log("Starting Customer App Screenshots...");
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    
    // 04.1 Landing Page Hero
    try {
      await page.locator('#home').waitFor({ state: 'visible', timeout: 10000 });
      await page.locator('#home').screenshot({ path: path.join(screenshotDir, '04.1-landing-page-hero.png') });
      reportSuccess('04.1-landing-page-hero.png');
    } catch (e) {
      reportError('04.1-landing-page-hero.png', e);
    }

    // 04.2 Menu
    try {
      await page.locator('#menu').waitFor({ state: 'visible', timeout: 5000 });
      await page.locator('#menu').screenshot({ path: path.join(screenshotDir, '04.2-menu.png') });
      reportSuccess('04.2-menu.png');
    } catch (e) {
      reportError('04.2-menu.png', e);
    }

    // 04.3 Promo
    try {
      await page.locator('.menu-section__promos').waitFor({ state: 'visible', timeout: 5000 });
      await page.locator('.menu-section__promos').screenshot({ path: path.join(screenshotDir, '04.3-promo.png') });
      reportSuccess('04.3-promo.png');
    } catch (e) {
      reportError('04.3-promo.png', e);
    }

    // 04.4 Gallery
    try {
      await page.locator('#gallery').waitFor({ state: 'visible', timeout: 5000 });
      await page.locator('#gallery').screenshot({ path: path.join(screenshotDir, '04.4-gallery.png') });
      reportSuccess('04.4-gallery.png');
    } catch (e) {
      reportError('04.4-gallery.png', e);
    }

    // 04.5 Reservasi
    try {
      await page.locator('#reservasi').waitFor({ state: 'visible', timeout: 5000 });
      await page.locator('#reservasi').screenshot({ path: path.join(screenshotDir, '04.5-reservasi.png') });
      reportSuccess('04.5-reservasi.png');
    } catch (e) {
      reportError('04.5-reservasi.png', e);
    }

    // 04.6 About
    try {
      await page.locator('#about').waitFor({ state: 'visible', timeout: 5000 });
      await page.locator('#about').screenshot({ path: path.join(screenshotDir, '04.6-about.png') });
      reportSuccess('04.6-about.png');
    } catch (e) {
      reportError('04.6-about.png', e);
    }

    // 04.7 Cart
    try {
      await page.locator('.navbar__cta').click();
      await page.locator('.cart-modal').waitFor({ state: 'visible', timeout: 5000 });
      await page.locator('.cart-modal').screenshot({ path: path.join(screenshotDir, '04.7-keranjang-belanja.png') });
      // Close cart by clicking overlay
      await page.locator('.cart-overlay').click({ position: { x: 10, y: 10 }, force: true });
      reportSuccess('04.7-keranjang-belanja.png');
    } catch (e) {
      reportError('04.7-keranjang-belanja.png', e);
    }

  } catch (e) {
    console.error("Error connecting to Customer App:", e.message);
  }

  console.log("Starting Admin App Screenshots...");
  try {
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

    // 04.8 Login Admin
    try {
      await page.locator('[data-testid="input-username"]').waitFor({ state: 'visible', timeout: 10000 });
      await page.screenshot({ path: path.join(screenshotDir, '04.8-login-admin.png') });
      reportSuccess('04.8-login-admin.png');
      
      // Perform login
      await page.fill('[data-testid="input-username"]', 'admin1');
      await page.fill('[data-testid="input-password"]', 'admin123');
      await page.click('[data-testid="btn-login"]');
      
      // Wait for dashboard to load (Reservasi tab is default)
      await page.waitForSelector('[data-testid="tab-reservasi"]', { timeout: 10000 });
    } catch (e) {
      reportError('04.8-login-admin.png', e);
    }

    // 04.9 Kelola Menu
    try {
      await page.click('[data-testid="tab-menu"]');
      await page.waitForTimeout(1000); // give time to fetch data and render
      await page.screenshot({ path: path.join(screenshotDir, '04.9-kelola-menu.png') });
      reportSuccess('04.9-kelola-menu.png');
    } catch (e) {
      reportError('04.9-kelola-menu.png', e);
    }

    // 04.10 Kelola Promo
    try {
      await page.click('[data-testid="tab-promo"]');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(screenshotDir, '04.10-kelola-promo.png') });
      reportSuccess('04.10-kelola-promo.png');
    } catch (e) {
      reportError('04.10-kelola-promo.png', e);
    }

    // 04.11 Kelola Reservasi
    try {
      await page.click('[data-testid="tab-reservasi"]');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(screenshotDir, '04.11-kelola-reservasi.png') });
      reportSuccess('04.11-kelola-reservasi.png');
    } catch (e) {
      reportError('04.11-kelola-reservasi.png', e);
    }

    // 04.12 Kelola Halaman / Konten
    try {
      await page.click('[data-testid="tab-halaman"]');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(screenshotDir, '04.12-kelola-konten.png') });
      reportSuccess('04.12-kelola-konten.png');
    } catch (e) {
      reportError('04.12-kelola-konten.png', e);
    }

  } catch (e) {
    console.error("Error connecting to Admin App:", e.message);
  }

  await browser.close();

  console.log("=== SCREENSHOT REPORT ===");
  console.log(JSON.stringify(status, null, 2));
}

run().catch(console.error);
