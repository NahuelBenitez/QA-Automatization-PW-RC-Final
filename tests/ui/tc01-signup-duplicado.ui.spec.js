import { test, expect } from '@playwright/test';

const API = 'https://api.demoblaze.com';

test.describe('TC01 - Signup duplicado UI', () => {

  test('UI: intentar registrar usuario ya existente muestra alerta', async ({ request, page }) => {

    // Creamos un username unico para esta corrida
    const username = `tc01_ui_${Date.now()}`;
    const password = 'bootcamp123';

    
//PASO 1 — Creamos el usuario por API (rápido y confiable)

    await request.post(`${API}/signup`, {
      data: { username, password }
    });

    
//PASO 2 — Navegamos a DemoBlaze e intentamos registrar el mismo usuario por UI

    await page.goto('/');

    // Abrimos el modal de signup
    await page.click('#signin2');
    await expect(page.locator('#signInModal')).toBeVisible();

    // Completamos el formulario con el usuario ya existente
    await page.fill('#sign-username', username);
    await page.fill('#sign-password', password);

    
//PASO 3 — Capturamos el dialog (alert) ANTES de clickear el botón

    const dialogPromise = page.waitForEvent('dialog');
    await page.click('#signInModal .btn-primary');
    const dialog = await dialogPromise;

    
//PASO 4 — Verificamos el mensaje del alert y lo cerramos

    console.log('Mensaje del alert:', dialog.message());
    expect(dialog.message()).toContain('This user already exist.');
    await dialog.accept();
  });

});