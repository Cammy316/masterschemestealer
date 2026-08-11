/**
 * The upload control must let a phone user choose where the image comes from.
 *
 * `capture="environment"` on a file input does not mean "offer the camera" — it
 * means "USE the camera". Mobile browsers honour it by skipping the
 * Photo Library / Take Photo / Browse chooser entirely, so the control becomes a
 * camera button and nothing else.
 *
 * On the inspiration tab that was backwards: the tab exists to steal a colour
 * scheme out of an image you already have — a screenshot, a saved photo, a
 * poster someone sent you. Shipping it meant the primary flow was unreachable on
 * the primary device.
 *
 * This is a one-attribute regression that is invisible on desktop, where the
 * chooser is a file dialog either way. It needs a test precisely because nobody
 * developing on a laptop will ever notice it coming back.
 */
import { test, expect } from '@playwright/test';

const MOBILE = { width: 430, height: 932 };

test.describe('image upload lets the user pick a source', () => {
  test('the inspiration portal does not force the camera', async ({ page }) => {
    await page.route('**/api/**', (r) =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
    );
    await page.setViewportSize(MOBILE);
    await page.goto('/inspiration');

    const input = page.locator('input[type="file"]');
    await expect(input).toHaveCount(1);

    // Intent: absent means the OS shows its normal chooser, with the camera
    // still one tap away. Present means the camera is the ONLY option.
    const capture = await input.getAttribute('capture');
    expect(capture, 'capture= forces the camera and hides the photo library').toBeNull();

    // It must still accept images, or the chooser offers everything on the device.
    await expect(input).toHaveAttribute('accept', /image/);
  });
});
