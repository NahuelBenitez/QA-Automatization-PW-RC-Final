import { test, expect } from '@playwright/test';

const API = process.env.API_URL;

test.describe('TC01 - Signup duplicado UI', () => {

  test('UI: intentar registrar usuario ya existente muestra alerta', async ({ request, page }) => {
    const username = `tc01_ui_${Date.now()}`;
    const password = 'bootcamp123';

    // Setup por API (confiable)
    await request.post(`${API}/signup`, {
      data: { username, password }
    });

    await page.goto('/');

    // Locators de Codegen (más robustos)
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'Username:' }).fill(username);
    await page.getByRole('textbox', { name: 'Password:' }).fill(password);

    // Manejo del dialog con verificación real
    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: 'Sign up' }).click();
    const dialog = await dialogPromise;

    expect(dialog.message()).toContain('This user already exist.');
    await dialog.accept();
  });

});