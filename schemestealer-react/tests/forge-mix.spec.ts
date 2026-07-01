import { test, expect } from '@playwright/test';

test.describe('Forge Mix - Custom Alchemy Flow', () => {
  test('Add paints, mix them, simulate basecoat, and save custom recipe', async ({ page }) => {
    // Navigate to Forge
    await page.goto('/forge');
    
    // Ensure we are on INVENTORY tab
    await expect(page.getByRole('button', { name: 'INVENTORY' })).toBeVisible();

    // Open Add Paint Modal
    await page.getByRole('button', { name: '+ ADD PAINT' }).click();
    await expect(page.getByPlaceholder('Search by name or brand')).toBeVisible();

    // Search and add first paint
    await page.getByPlaceholder('Search by name or brand').fill('Mephiston Red');
    // Wait for debounce/search
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

    // Verify paints are in inventory selector
    await expect(page.getByText('Mephiston Red')).toBeVisible();
    await expect(page.getByText('Abaddon Black')).toBeVisible();

    // Verify empty crucible
    await expect(page.getByText('EMPTY CRUCIBLE')).toBeVisible();

    // Click paints to add to mix (they share the same node structure, so we can click by text)
    await page.getByText('Mephiston Red').click();
    await page.getByText('Abaddon Black').click();

    // Verify mix is created
    await expect(page.getByText('CUSTOM MIX')).toBeVisible();

    // Toggle Basecoat Simulator (it's the top-left absolute button)
    const primerToggleBtn = page.locator('button.absolute.top-4.left-4');
    await primerToggleBtn.click();
    
    // Select 'Grey' basecoat
    await page.getByRole('button', { name: 'Grey' }).click();

    // Open Save Mix popover (it's the top-right absolute button in the canvas)
    const saveToggleBtn = page.locator('button.absolute.top-4.right-4');
    await saveToggleBtn.click();

    // Type name and save
    await page.getByPlaceholder('Name your mix...').fill('Dark Red Mix');
    await page.getByRole('button', { name: 'SAVE' }).click();

    // Clear the current mix to see the inventory list clearly
    await page.getByRole('button', { name: '[ CLEAR MIX ]' }).click();

    // Verify the custom mix is now in the inventory selector list!
    await expect(page.getByText('Dark Red Mix')).toBeVisible();
  });
});
