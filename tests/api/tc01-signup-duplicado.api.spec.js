import { test, expect } from '@playwright/test';

// URL base de la API de DemoBlaze
const API = 'https://api.demoblaze.com';

test.describe('TC01 - Signup duplicado', () => {

  test('API: registrar el mismo usuario dos veces retorna error', async ({ request }) => {

    // Creamos un username unico con timestamp para esta corrida
    const username = `tc01_user_${Date.now()}`;
    const password = 'bootcamp123';

    
//PASO 1 — Primer signup: debe salir bien (respuesta vacía = éxito en DemoBlaze)

    const primerRegistro = await request.post(`${API}/signup`, {
      data: { username, password }
    });
    expect(primerRegistro.status()).toBe(200);

    
//PASO 2 — Segundo signup con el mismo username: debe retornar error

    const segundoRegistro = await request.post(`${API}/signup`, {
      data: { username, password }
    });
    expect(segundoRegistro.status()).toBe(200);

    
//PASO 3 — Verificamos el cuerpo: DemoBlaze devuelve JSON con campo "errorMessage"

    const body = await segundoRegistro.json();
    console.log('Respuesta segundo signup:', body);

    expect(body).toHaveProperty('errorMessage');
    expect(body.errorMessage).toContain('This user already exist.');
  });

});