import { test, expect } from '@fixtures/api';
import { errorSchema, loginResponseSchema } from '@api/schemas';

// Public demo account documented by DummyJSON.
const DEMO_USER = { username: 'emilys', password: 'emilyspass' };

test.describe('Auth API', () => {
  test('login returns tokens that identify the user', { tag: '@smoke' }, async ({ authApi }) => {
    const login = await authApi.login(DEMO_USER.username, DEMO_USER.password);
    expect(login.status()).toBe(200);
    const { accessToken, username } = loginResponseSchema.parse(await login.json());
    expect(username).toBe(DEMO_USER.username);

    const me = await authApi.me(accessToken);
    expect(me.status()).toBe(200);
    expect(await me.json()).toMatchObject({ username: DEMO_USER.username });
  });

  test('rejects invalid credentials', async ({ authApi }) => {
    const response = await authApi.login(DEMO_USER.username, 'wrong-password');

    expect(response.status()).toBe(400);
    expect(errorSchema.parse(await response.json()).message).toBe('Invalid credentials');
  });

  test('protected endpoint requires a token', async ({ authApi }) => {
    const response = await authApi.me();

    expect(response.status()).toBe(401);
  });

  test('protected endpoint rejects a forged token', async ({ authApi }) => {
    const response = await authApi.me('not-a-real-token');

    expect(response.status()).toBe(401);
  });
});
