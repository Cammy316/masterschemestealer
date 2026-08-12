import { test, expect } from '@playwright/test';

test.describe('Requisitions Cart Flow', () => {
  test('Add to cart from Forge Mix alternatives and manage quantities', async ({ page }) => {
    // Navigate to Forge
    await page.goto('/forge');
    
    // Ensure we are on INVENTORY tab
    await expect(page.getByRole('button', { name: 'INVENTORY' })).toBeVisible();

    // Open Add Paint Modal
    await page.getByRole('button', { name: '+ ADD PAINT' }).click();
    await expect(page.getByPlaceholder('Search by name or brand')).toBeVisible();

    // Search and add first paint
    await page.getByPlaceholder('Search by name or brand').fill('Mephiston Red');
    await page.waitForTimeout(500); 
    await page.getByRole('button', { name: 'ADD +' }).first().click();

    // Search and add second paint
    await page.getByPlaceholder('Search by name or brand').fill('Abaddon Black');
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'ADD +' }).first().click();

    // Close the modal. See the note in forge-mix.spec.ts — aria-label="Close"
    // is the accessible name, so the ✕ glyph no longer matches.
    await page.getByRole('button', { name: 'Close' }).click();

    // Switch to FORGE MIX tab
    await page.getByRole('button', { name: 'FORGE MIX' }).click();

    // Click paints to add to mix
    await page.getByText('Mephiston Red').click();
    await page.getByText('Abaddon Black').click();

    // Wait for the simulated mix to calculate top matches
    await expect(page.getByText('TOP BRAND ALTERNATIVES')).toBeVisible();

    // Click + CART on the first alternative
    const firstCartBtn = page.getByRole('button', { name: '+ CART' }).first();
    await firstCartBtn.click();

    // Switch to REQUISITIONS tab
    await page.getByRole('button', { name: /requisition/i }).click();

    // Verify item is in cart (should not be empty)
    await expect(page.getByText('1 ITEM TOTAL')).toBeVisible();

    // The +/- controls carry aria-labels, so the glyphs are not their
    // accessible names. Assert against the quantity readout rather than the
    // "N ITEMS TOTAL" header: the header counts distinct lines, not units, so
    // bumping one paint to 2 correctly leaves it reading "1 ITEM TOTAL".
    const quantity = page.locator('span.font-mono').filter({ hasText: /^\d+$/ }).first();

    await page.getByRole('button', { name: 'Increase quantity' }).click();
    await expect(quantity).toHaveText('2');

    await page.getByRole('button', { name: 'Decrease quantity' }).click();
    await expect(quantity).toHaveText('1');
    await expect(page.getByText('1 ITEM TOTAL')).toBeVisible();

    // Clear the cart
    await page.getByRole('button', { name: 'CLEAR CART' }).click();

    // Verify cart is empty
    await expect(page.getByText('REQUISITION EMPTY')).toBeVisible();
  });
});
