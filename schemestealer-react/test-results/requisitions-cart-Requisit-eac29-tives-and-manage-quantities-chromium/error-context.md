# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: requisitions-cart.spec.ts >> Requisitions Cart Flow >> Add to cart from Forge Mix alternatives and manage quantities
- Location: tests\requisitions-cart.spec.ts:4:7

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'ADD +' }).first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "Home" [ref=e5] [cursor=pointer]:
        - /url: /
        - generic [ref=e6]:
          - img [ref=e8]
          - generic [ref=e11]: Home
      - link "Miniscan" [ref=e12] [cursor=pointer]:
        - /url: /miniature
        - generic [ref=e13]:
          - img [ref=e15]
          - generic [ref=e20]: Miniscan
      - link "Inspiration" [ref=e21] [cursor=pointer]:
        - /url: /inspiration
        - generic [ref=e22]:
          - img [ref=e24]
          - generic [ref=e29]: Inspiration
      - link "The Forge" [ref=e30] [cursor=pointer]:
        - /url: /forge
        - generic [ref=e31]:
          - img [ref=e34]
          - generic [ref=e36]: The Forge
  - main [ref=e37]:
    - generic [ref=e38]:
      - generic:
        - generic:
          - img
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading [level=1] [ref=e41]: THE FORGE
          - paragraph [ref=e42]: Inventory • Alchemy • Requisitions
        - generic [ref=e43]:
          - button [ref=e44]: inventory
          - button [ref=e45]: FORGE MIX
          - button [ref=e46]: requisition
        - generic [ref=e48]:
          - button [ref=e51]:
            - generic [ref=e52]: "?"
          - generic [ref=e54]:
            - generic [ref=e57]:
              - generic [ref=e58]:
                - heading [level=3] [ref=e59]: EMPTY DATABANKS
                - paragraph [ref=e60]: Your organic hive is empty. Add paints to see your collection grow.
                - button [ref=e61] [cursor=pointer]: + ADD FIRST PAINT
              - generic [ref=e63] [cursor=pointer]:
                - generic: +
              - generic [ref=e66] [cursor=pointer]:
                - generic: +
              - generic [ref=e69] [cursor=pointer]:
                - generic: +
              - generic [ref=e72] [cursor=pointer]:
                - generic: +
              - generic [ref=e75] [cursor=pointer]:
                - generic: +
              - generic [ref=e78] [cursor=pointer]:
                - generic: +
              - generic [ref=e81] [cursor=pointer]:
                - generic: +
              - generic [ref=e84] [cursor=pointer]:
                - generic: +
              - generic [ref=e87] [cursor=pointer]:
                - generic: +
              - generic [ref=e90] [cursor=pointer]:
                - generic: +
              - generic [ref=e93] [cursor=pointer]:
                - generic: +
              - generic [ref=e96] [cursor=pointer]:
                - generic: +
              - generic [ref=e99] [cursor=pointer]:
                - generic: +
              - generic [ref=e102] [cursor=pointer]:
                - generic: +
              - generic [ref=e105] [cursor=pointer]:
                - generic: +
              - generic [ref=e108] [cursor=pointer]:
                - generic: +
              - generic [ref=e111] [cursor=pointer]:
                - generic: +
              - generic [ref=e114] [cursor=pointer]:
                - generic: +
              - generic [ref=e117] [cursor=pointer]:
                - generic: +
              - generic [ref=e120] [cursor=pointer]:
                - generic: +
              - generic [ref=e123] [cursor=pointer]:
                - generic: +
              - generic [ref=e126] [cursor=pointer]:
                - generic: +
              - generic [ref=e129] [cursor=pointer]:
                - generic: +
              - generic [ref=e132] [cursor=pointer]:
                - generic: +
              - generic [ref=e135] [cursor=pointer]:
                - generic: +
              - generic [ref=e138] [cursor=pointer]:
                - generic: +
              - generic [ref=e141] [cursor=pointer]:
                - generic: +
              - generic [ref=e144] [cursor=pointer]:
                - generic: +
              - generic [ref=e147] [cursor=pointer]:
                - generic: +
              - generic [ref=e150] [cursor=pointer]:
                - generic: +
              - generic [ref=e153] [cursor=pointer]:
                - generic: +
              - generic [ref=e156] [cursor=pointer]:
                - generic: +
              - generic [ref=e159] [cursor=pointer]:
                - generic: +
              - generic [ref=e162] [cursor=pointer]:
                - generic: +
              - generic [ref=e165] [cursor=pointer]:
                - generic: +
              - generic [ref=e168] [cursor=pointer]:
                - generic: +
              - generic [ref=e171] [cursor=pointer]:
                - generic: +
              - generic [ref=e174] [cursor=pointer]:
                - generic: +
              - generic [ref=e177] [cursor=pointer]:
                - generic: +
              - generic [ref=e180] [cursor=pointer]:
                - generic: +
              - generic [ref=e183] [cursor=pointer]:
                - generic: +
              - generic [ref=e186] [cursor=pointer]:
                - generic: +
            - generic [ref=e188]:
              - button [ref=e189]: +
              - button [ref=e190]: "-"
              - button [ref=e191]:
                - img [ref=e192]
            - button [ref=e196]: + ADD PAINT
  - generic [ref=e197]:
    - generic [ref=e198]:
      - generic [ref=e199]:
        - heading "Telemetry Auspex" [level=3] [ref=e200]
        - paragraph [ref=e201]: We use minimal, anonymized telemetry to improve our servitors and detect heresy. No personal data is sold. Do you consent to auspex scanning?
      - button [ref=e202]:
        - img [ref=e203]
    - generic [ref=e206]:
      - button "Accept" [ref=e207]
      - button "Decline" [ref=e208]
  - button "Open Next.js Dev Tools" [ref=e214] [cursor=pointer]:
    - img [ref=e215]
  - alert [ref=e218]
  - generic:
    - generic:
      - generic:
        - dialog "ACQUISITION LOG":
          - generic [ref=e221]:
            - generic [ref=e222]:
              - heading "ACQUISITION LOG" [level=2] [ref=e223]
              - button "✕" [ref=e224]
            - generic [ref=e225]:
              - button "Search Databanks" [ref=e226]
              - button "Auspex Scan EXP" [ref=e227]:
                - text: Auspex Scan
                - generic [ref=e228]: EXP
            - generic [ref=e230]:
              - textbox "Search by name or brand (e.g. Mephiston Red)" [active] [ref=e231]: Mephiston Red
              - generic [ref=e232]: NO RECORDS FOUND IN DATABANKS
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Requisitions Cart Flow', () => {
  4  |   test('Add to cart from Forge Mix alternatives and manage quantities', async ({ page }) => {
  5  |     // Navigate to Forge
  6  |     await page.goto('/forge');
  7  |     
  8  |     // Ensure we are on INVENTORY tab
  9  |     await expect(page.getByRole('button', { name: 'INVENTORY' })).toBeVisible();
  10 | 
  11 |     // Open Add Paint Modal
  12 |     await page.getByRole('button', { name: '+ ADD PAINT' }).click();
  13 |     await expect(page.getByPlaceholder('Search by name or brand')).toBeVisible();
  14 | 
  15 |     // Search and add first paint
  16 |     await page.getByPlaceholder('Search by name or brand').fill('Mephiston Red');
  17 |     await page.waitForTimeout(500); 
> 18 |     await page.getByRole('button', { name: 'ADD +' }).first().click();
     |                                                               ^ Error: locator.click: Test timeout of 120000ms exceeded.
  19 | 
  20 |     // Search and add second paint
  21 |     await page.getByPlaceholder('Search by name or brand').fill('Abaddon Black');
  22 |     await page.waitForTimeout(500);
  23 |     await page.getByRole('button', { name: 'ADD +' }).first().click();
  24 | 
  25 |     // Close the modal
  26 |     await page.getByRole('button', { name: '✕' }).click();
  27 | 
  28 |     // Switch to FORGE MIX tab
  29 |     await page.getByRole('button', { name: 'FORGE MIX' }).click();
  30 | 
  31 |     // Click paints to add to mix
  32 |     await page.getByText('Mephiston Red').click();
  33 |     await page.getByText('Abaddon Black').click();
  34 | 
  35 |     // Wait for the simulated mix to calculate top matches
  36 |     await expect(page.getByText('TOP BRAND ALTERNATIVES')).toBeVisible();
  37 | 
  38 |     // Click + CART on the first alternative
  39 |     const firstCartBtn = page.getByRole('button', { name: '+ CART' }).first();
  40 |     await firstCartBtn.click();
  41 | 
  42 |     // Switch to REQUISITIONS tab
  43 |     await page.getByRole('button', { name: /requisition/i }).click();
  44 | 
  45 |     // Verify item is in cart (should not be empty)
  46 |     await expect(page.getByText('1 ITEM TOTAL')).toBeVisible();
  47 | 
  48 |     // Find the increment button (+)
  49 |     // It's the button containing a '+' span
  50 |     const incrementBtn = page.getByRole('button', { name: '+' });
  51 |     await incrementBtn.click();
  52 | 
  53 |     // Verify quantity updated
  54 |     await expect(page.getByText('2 ITEMS TOTAL')).toBeVisible();
  55 | 
  56 |     // Find the decrement button (-)
  57 |     const decrementBtn = page.getByRole('button', { name: '−' }); // Note: Using minus sign from ShoppingCart.tsx
  58 |     await decrementBtn.click();
  59 | 
  60 |     // Verify quantity updated back
  61 |     await expect(page.getByText('1 ITEM TOTAL')).toBeVisible();
  62 | 
  63 |     // Clear the cart
  64 |     await page.getByRole('button', { name: 'CLEAR CART' }).click();
  65 | 
  66 |     // Verify cart is empty
  67 |     await expect(page.getByText('REQUISITION EMPTY')).toBeVisible();
  68 |   });
  69 | });
  70 | 
```