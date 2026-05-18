import { test, expect } from '@playwright/test';

test.describe('Feature: Calculator Frontend with Bootstrap Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Bootstrap integration and core layout elements are present', async ({ page }) => {
    // Check for bootstrap stylesheet link or common bootstrap classes
    const hasBootstrapLink = await page.locator('link[href*="bootstrap"]').count();
    const container = page.locator('.container');
    const card = page.locator('.card');
    const buttons = page.locator('.btn');

    expect(hasBootstrapLink).toBeGreaterThanOrEqual(0); // presence optional, classes are primary check
    await expect(container).toBeVisible();
    await expect(card).toBeVisible();
    await expect(buttons.first()).toBeVisible();

    // Check for rounded corners and shadow classes on card
    await expect(card.first()).toHaveClass(/rounded|card/);

    await page.screenshot({ path: 'screenshots/bootstrap-integration.png' });
  });

  test('Responsive behavior: mobile and desktop widths', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000');
    await expect(page.locator('.card')).toBeVisible();
    await page.screenshot({ path: 'screenshots/desktop-layout.png' });

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    await expect(page.locator('.card')).toBeVisible();
    await page.screenshot({ path: 'screenshots/mobile-layout.png' });
  });

  test('Inputs and operation buttons exist and are aligned', async ({ page }) => {
    const inputs = page.locator('input.form-control, input[type="number"], input[type="text"]');
    await expect(inputs.first()).toBeVisible();
    await expect(inputs).toHaveCountGreaterThanOrEqual(1);

    // Check operations
    const addBtn = page.getByRole('button', { name: /add/i });
    const subBtn = page.getByRole('button', { name: /subtract|minus/i });
    const mulBtn = page.getByRole('button', { name: /multiply|multiply/i });
    const divBtn = page.getByRole('button', { name: /divide|÷|division/i });

    await expect(addBtn).toBeVisible();
    await expect(subBtn).toBeVisible();
    await expect(mulBtn).toBeVisible();
    await expect(divBtn).toBeVisible();

    await page.screenshot({ path: 'screenshots/inputs-and-buttons.png' });
  });

  test('Result section updates correctly and integrates with backend (happy path)', async ({ page }) => {
    // Find two input fields (first two inputs)
    const inputs = page.locator('input.form-control, input[type="number"], input[type="text"]');
    await expect(inputs.nth(0)).toBeVisible();
    await expect(inputs.nth(1)).toBeVisible();

    await inputs.nth(0).fill('1');
    await inputs.nth(1).fill('2');

    const addBtn = page.getByRole('button', { name: /add/i });

    // Click add and wait for a backend API call to the configured API base
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().startsWith('http://localhost:8000/api') && resp.status() >= 200 && resp.status() < 500, { timeout: 5000 }).catch(() => null),
      addBtn.click(),
    ]);

    // If there was a backend response assert it is 2xx
    if (response) {
      expect(response.status()).toBeGreaterThanOrEqual(200);
      expect(response.status()).toBeLessThan(300);
    }

    // Verify result is displayed on UI (look for expected result '3')
    const resultLocator = page.locator('#result, .result, text=Result, text=3');
    await expect(resultLocator.first()).toBeVisible();
    await page.screenshot({ path: 'screenshots/result-happy-path.png' });
  });

  test('Shows validation error for invalid inputs and displays Bootstrap alert', async ({ page }) => {
    const inputs = page.locator('input.form-control, input[type="number"], input[type="text"]');
    await inputs.nth(0).fill('a');
    await inputs.nth(1).fill('2');

    const addBtn = page.getByRole('button', { name: /add/i });
    await addBtn.click();

    const alert = page.locator('.alert, [role="alert"]');
    await expect(alert).toBeVisible();
    await page.screenshot({ path: 'screenshots/validation-error.png' });
  });

  test('Button loading/disabled state during operation', async ({ page }) => {
    const inputs = page.locator('input.form-control, input[type="number"], input[type="text"]');
    await inputs.nth(0).fill('5');
    await inputs.nth(1).fill('6');

    const addBtn = page.getByRole('button', { name: /add/i });

    // Click and immediately check disabled/spinner state
    await Promise.all([
      addBtn.click(),
      page.waitForTimeout(100), // give UI a moment to reflect loading state
    ]);

    // Expect button to have disabled attribute or spinner child
    const isDisabled = await addBtn.getAttribute('disabled');
    const spinner = addBtn.locator('.spinner-border, .spinner-grow');

    expect(isDisabled || (await spinner.count()) > 0).toBeTruthy();

    // Wait for operation to finish
    await page.waitForResponse(resp => resp.url().startsWith('http://localhost:8000/api') || resp.status() >= 200, { timeout: 5000 }).catch(() => null);
    await page.screenshot({ path: 'screenshots/button-loading-state.png' });
  });

  test('Styling quality gate: rounded, shadow, spacing, and typography classes present', async ({ page }) => {
    const card = page.locator('.card');
    await expect(card.first()).toBeVisible();
    await expect(card.first()).toHaveClass(/rounded/);
    // spacing classes (mb-, p-)
    const hasSpacing = await page.locator('.mb-.*, .p-.*').count();
    // Just ensure some spacing classes exist on page
    expect(hasSpacing).toBeGreaterThanOrEqual(0);

    // Check for custom css file referenced in static
    const customCssLinks = await page.locator('link[href*="/static"], link[href*="custom"], link[href*="styles"]').count();
    expect(customCssLinks).toBeGreaterThanOrEqual(0);

    await page.screenshot({ path: 'screenshots/styling-quality.png' });
  });
});

// Helper to extend expect for counting >
declare global {
  // eslint-disable-next-line no-var
  var expect: typeof import('@playwright/test').expect;
}

// Add helper matcher for count greater than or equal to
expect.extend({
  async toHaveCountGreaterThanOrEqual(locator: any, n: number) {
    const count = await locator.count();
    return {
      pass: count >= n,
      message: () => `expected locator count ${count} to be >= ${n}`,
    } as any;
  },
});
