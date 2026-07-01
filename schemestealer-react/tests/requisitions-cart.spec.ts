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

    // Close the modal
    await page.getByRole('button', { name: '✕' }).click();

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

    // Find the increment button (+)
    // It's the button containing a '+' span
    const incrementBtn = page.getByRole('button', { name: '+' });
    await incrementBtn.click();

    // Verify quantity updated
    await expect(page.getByText('2 ITEMS TOTAL')).toBeVisible();

    // Find the decrement button (-)
    const decrementBtn = page.getByRole('button', { name: '−' }); // Note: Using minus sign from ShoppingCart.tsx
    await decrementBtn.click();

    // Verify quantity updated back
    await expect(page.getByText('1 ITEM TOTAL')).toBeVisible();

    // Clear the cart
    await page.getByRole('button', { name: 'CLEAR CART' }).click();

    // Verify cart is empty
    await expect(page.getByText('REQUISITION EMPTY')).toBeVisible();
  });
});
