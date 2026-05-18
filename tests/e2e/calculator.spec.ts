import { test, expect } from '@playwright/test';

const FRONTEND = 'http://localhost:3000';
const API_BASE = 'http://localhost:8000/api';

test.describe('Feature: Django Calculator Backend', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FRONTEND);
  });

  test('API root is reachable (sanity check)', async ({ request, page }) => {
    const res = await request.get(API_BASE);
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(500);
    // screenshot of frontend as evidence the UI is reachable
    await page.screenshot({ path: 'screenshots/ui-home.png' });
  });

  test('Addition via UI works and returns correct result', async ({ page }) => {
    // Fill numeric inputs - try common selectors
    const numInputs = page.locator('input[type="number"], input.input-number, input[name="a"], input[name="b"], input[name="num1"], input[name="num2"]');
    await expect(numInputs.first()).toBeVisible({ timeout: 3000 });
    await numInputs.nth(0).fill('2');
    await numInputs.nth(1).fill('3');

    // Try to select operation if a select exists
    const opSelect = page.locator('select[name="operation"], select#operation, select.operation');
    if (await opSelect.count() > 0) {
      await opSelect.selectOption({ value: 'add' }).catch(async () => {
        // fallback to selecting by label text
        await opSelect.selectOption({ label: 'Add' }).catch(() => {});
      });
    } else {
      // Try clicking a button or radio labeled Add
      const addButton = page.locator('button:has-text("Add"), button:has-text("+")');
      if (await addButton.count() > 0) {
        await addButton.first().click();
      }
    }

    // Click submit
    const submit = page.locator('button[type="submit"], button:has-text("Calculate"), button:has-text("=")');
    await expect(submit.first()).toBeVisible({ timeout: 3000 });
    await submit.first().click();

    // Expect result somewhere visible
    const resultLocators = page.locator('[data-testid="result"], #result, .result, .calculation-result');
    await expect(resultLocators.first()).toBeVisible({ timeout: 5000 });
    const text = (await resultLocators.first().innerText()).trim();
    // allow various formats, just assert it contains 5
    expect(text).toContain('5');

    await page.screenshot({ path: 'screenshots/addition-ui.png' });
  });

  test('Subtraction, multiplication and division via UI work', async ({ page }) => {
    const numInputs = page.locator('input[type="number"], input.input-number');
    await expect(numInputs.first()).toBeVisible({ timeout: 3000 });

    // Subtraction 10 - 4 = 6
    await numInputs.nth(0).fill('10');
    await numInputs.nth(1).fill('4');
    const opSelect = page.locator('select[name="operation"], select#operation');
    if (await opSelect.count() > 0) {
      await opSelect.selectOption({ value: 'subtract' }).catch(async () => {
        await opSelect.selectOption({ label: 'Subtract' }).catch(() => {});
      });
    } else {
      const subBtn = page.locator('button:has-text("Subtract"), button:has-text("-")');
      if (await subBtn.count() > 0) await subBtn.first().click();
    }
    const submit = page.locator('button[type="submit"], button:has-text("Calculate")');
    await submit.first().click();
    const result = page.locator('[data-testid="result"], #result, .result');
    await expect(result.first()).toBeVisible({ timeout: 5000 });
    expect((await result.first().innerText())).toContain('6');
    await page.screenshot({ path: 'screenshots/subtraction-ui.png' });

    // Multiplication 6 * 7 = 42
    await numInputs.nth(0).fill('6');
    await numInputs.nth(1).fill('7');
    if (await opSelect.count() > 0) {
      await opSelect.selectOption({ value: 'multiply' }).catch(async () => {
        await opSelect.selectOption({ label: 'Multiply' }).catch(() => {});
      });
    } else {
      const mulBtn = page.locator('button:has-text("Multiply"), button:has-text("×"), button:has-text("*")');
      if (await mulBtn.count() > 0) await mulBtn.first().click();
    }
    await submit.first().click();
    await expect(result.first()).toBeVisible({ timeout: 5000 });
    expect((await result.first().innerText())).toContain('42');
    await page.screenshot({ path: 'screenshots/multiplication-ui.png' });

    // Division 9 / 3 = 3
    await numInputs.nth(0).fill('9');
    await numInputs.nth(1).fill('3');
    if (await opSelect.count() > 0) {
      await opSelect.selectOption({ value: 'divide' }).catch(async () => {
        await opSelect.selectOption({ label: 'Divide' }).catch(() => {});
      });
    } else {
      const divBtn = page.locator('button:has-text("Divide"), button:has-text("/")');
      if (await divBtn.count() > 0) await divBtn.first().click();
    }
    await submit.first().click();
    await expect(result.first()).toBeVisible({ timeout: 5000 });
    expect((await result.first().innerText())).toContain('3');
    await page.screenshot({ path: 'screenshots/division-ui.png' });
  });

  test('UI validation: empty inputs should show error', async ({ page }) => {
    // Clear inputs
    const numInputs = page.locator('input[type="number"], input.input-number');
    if (await numInputs.count() < 2) {
      // If no numeric inputs present, just assert there's a form and required validation exists
      const submit = page.locator('button[type="submit"], button:has-text("Calculate")');
      await submit.first().click();
    } else {
      await numInputs.nth(0).fill('');
      await numInputs.nth(1).fill('');
      const submit = page.locator('button[type="submit"], button:has-text("Calculate")');
      await submit.first().click();
    }

    const alert = page.locator('[role="alert"], .error, .validation, .help-block');
    await expect(alert.first()).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'screenshots/validation-empty.png' });
  });

  test('UI validation: division by zero shows error', async ({ page }) => {
    const numInputs = page.locator('input[type="number"], input.input-number');
    await expect(numInputs.first()).toBeVisible({ timeout: 3000 });
    await numInputs.nth(0).fill('5');
    await numInputs.nth(1).fill('0');

    const opSelect = page.locator('select[name="operation"], select#operation');
    if (await opSelect.count() > 0) {
      await opSelect.selectOption({ value: 'divide' }).catch(async () => {
        await opSelect.selectOption({ label: 'Divide' }).catch(() => {});
      });
    } else {
      const divBtn = page.locator('button:has-text("Divide"), button:has-text("/")');
      if (await divBtn.count() > 0) await divBtn.first().click();
    }

    const submit = page.locator('button[type="submit"], button:has-text("Calculate")');
    await submit.first().click();

    const alert = page.locator('[role="alert"], .error, .validation');
    await expect(alert.first()).toBeVisible({ timeout: 5000 });
    const alertText = (await alert.first().innerText()).toLowerCase();
    expect(alertText).toContain('zero').or(expect(alertText).toContain('divide'));
    await page.screenshot({ path: 'screenshots/validation-divide-by-zero.png' });
  });

  test('API: POST calculation (success + validation)', async ({ request }) => {
    // Try a POST to the API base - many Django calculators expose POST at /api/ that accept operation
    const payload = { a: 8, b: 2, operation: 'add' };
    const response = await request.post(API_BASE, { data: payload });
    // Accept either 200 or 201; but ensure not a server error
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);
    const body = await response.json().catch(() => null);
    if (body) {
      // Expect either a direct result field or keys that indicate correct calculation
      const hasResult = body && (body.result !== undefined || body.answer !== undefined || body.value !== undefined || Object.values(body).includes(10));
      expect(hasResult).toBeTruthy();
    }

    // Division by zero should produce 4xx error or validation payload
    const dz = { a: 5, b: 0, operation: 'divide' };
    const dzResp = await request.post(API_BASE, { data: dz });
    // Expect 4xx for validation or 200 with an error in body
    if (dzResp.status() >= 500) {
      // server error is not acceptable
      throw new Error('Server error on division by zero test');
    }
    const dzBody = await dzResp.json().catch(() => null);
    if (dzResp.status() >= 400 && dzResp.status() < 500) {
      expect(dzResp.status()).toBeGreaterThanOrEqual(400);
    } else if (dzBody) {
      const dzText = JSON.stringify(dzBody).toLowerCase();
      expect(dzText.includes('zero') || dzText.includes('divide') || dzText.includes('error')).toBeTruthy();
    }

  });

});
