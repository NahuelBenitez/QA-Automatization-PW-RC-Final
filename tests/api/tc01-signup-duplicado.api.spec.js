import { test, expect } from '@playwright/test';

const API = process.env.API_URL;

test.describe('TC01 - Signup duplicado', () => {

  test('API: registrar el mismo usuario dos veces retorna error', async ({ request }) => {

    const username = `tc01_user_${Date.now()}`;
    const password = 'bootcamp123';

    // Primer signup: debe salir bien
    const primerRegistro = await request.post(`${API}/signup`, {
      data: { username, password }
    });
    expect(primerRegistro.status()).toBe(200);

    // Segundo signup con el mismo username: debe retornar error
    const segundoRegistro = await request.post(`${API}/signup`, {
      data: { username, password }
    });
    expect(segundoRegistro.status()).toBe(200);

    // Verificamos el cuerpo: devuelve JSON con campo errorMessage
    const body = await segundoRegistro.json();
    console.log('Respuesta segundo signup:', body);

    expect(body).toHaveProperty('errorMessage');
    expect(body.errorMessage).toContain('This user already exist.');
  });

});