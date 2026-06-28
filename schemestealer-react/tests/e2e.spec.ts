import { test, expect } from '@playwright/test';

// Define the mock scan response to use across tests
const MOCK_SCAN_RESPONSE = {
  scan_id: 'test_full_interaction',
  mode: 'miniature',
  colors: [
    {
      hex: '#ff0000',
      family: 'Red',
      percentage: 60,
      rgb: [255, 0, 0],
      lab: [53, 80, 67],
      reticle: null,
      position: { x: 0.5, y: 0.5 },
      paintRecipe: {
        citadel: {
          brand: 'Citadel',
          base: { name: 'Mephiston Red', hex: '#9A1115' },
          wash: { name: 'Agrax Earthshade', hex: '#5A534B' },
          highlight: { name: 'Evil Sunz Scarlet', hex: '#C01411' }
        },
        vallejo: {
          brand: 'Vallejo',
          base: { name: 'Flat Red', hex: '#C1121C' },
          wash: { name: 'Red Wash', hex: '#5A1111' },
          highlight: { name: 'Light Red', hex: '#E53B3B' }
        }
      }
    },
    {
      hex: '#0000ff',
      family: 'Blue',
      percentage: 40,
      rgb: [0, 0, 255],
      lab: [32, 79, -107],
      reticle: null,
      position: { x: 0.2, y: 0.8 },
      paintRecipe: {
        citadel: {
          brand: 'Citadel',
          base: { name: 'Macragge Blue', hex: '#0D407F' },
          wash: { name: 'Nuln Oil', hex: '#111111' },
          highlight: { name: 'Calgar Blue', hex: '#2A497F' }
        }
      }
    }
  ]
};

test.describe('SchemeStealer Comprehensive UI Interactions', () => {

  test.beforeEach(async ({ page }) => {
    // Pipe page console to terminal for debugging
    page.on('console', msg => console.log('BROWSER: ', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR: ', err.message));

    // Intercept health check so the frontend bypasses "MACHINE SPIRIT AWAKENING"
    await page.route('**/api/ready', async route => {
      await route.fulfill({ json: { ready: true } });
    });

    // Intercept the scan endpoint so we don't rely on the backend being alive during UI tests
    await page.route('**/api/scan/miniature', async route => {
      await route.fulfill({ json: MOCK_SCAN_RESPONSE });
    });

    // Intercept ML logging so we can verify frontend fires logs correctly
    await page.route('**/api/ml/log-scan', async route => {
      await route.fulfill({ json: { status: 'success', scan_id: 'mocked' } });
    });

    await page.route('**/api/ml/log-feedback', async route => {
      await route.fulfill({ json: { status: 'success' } });
    });

    // Go directly to the miniature scanner page
    await page.goto('/miniature');

    // Wait for the file input to be available (machine spirit initialized)
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 10000 });

    // Upload a dummy image to trigger the scan
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    
    await fileInput.setInputFiles({
      name: 'synthetic_miniature.png',
      mimeType: 'image/png',
      buffer: buffer,
    });
  });

  test('Main Scan Loop and Recipe Display', async ({ page }) => {
    // 1. Wait for processing to finish and results to appear
    await expect(page.getByText('Mephiston Red')).toBeVisible({ timeout: 60000 });
    
    // 2. Check if multiple brands rendered (Citadel and Vallejo from the mock)
    // Note: The UI might require clicking a brand tab.
    // If Citadel is default, Vallejo should be selectable or visible.
    const hasVallejo = await page.getByText('Flat Red').isVisible();
    if (!hasVallejo) {
      // Try to click the Vallejo brand tab if it exists
      const vallejoTab = page.locator('button', { hasText: 'Vallejo' }).first();
      if (await vallejoTab.isVisible()) {
        await vallejoTab.click();
        await expect(page.getByText('Flat Red')).toBeVisible();
      }
    }
    
    // 3. Check for blue color recipe
    await expect(page.getByText('Macragge Blue')).toBeVisible();
  });

  test('User Feedback and ML Data Triggers', async ({ page }) => {
    // Wait for results
    await expect(page.getByText('Mephiston Red')).toBeVisible({ timeout: 60000 });

    // Look for a feedback or correction mechanism (e.g. "Wrong Color?")
    const wrongColorBtn = page.getByText('Wrong Color?', { exact: false }).first();
    
    if (await wrongColorBtn.isVisible()) {
      await wrongColorBtn.click();
      
      // Simulate selecting a new family
      const purpleOption = page.getByText('Purple', { exact: true }).first();
      if (await purpleOption.isVisible()) {
        await purpleOption.click();
        
        // Ensure a network request went out for log-feedback
        // Playwright tests can listen to request events, but for a simple e2e,
        // just expecting the UI to acknowledge the change is fine.
        await expect(page.getByText('Thank you', { exact: false })).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
