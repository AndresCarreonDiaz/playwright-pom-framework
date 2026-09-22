import { type APIRequestContext, type APIResponse } from '@playwright/test';

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  login(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth/login', { data: { username, password } });
  }

  me(accessToken?: string): Promise<APIResponse> {
    const headers: Record<string, string> = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};
    return this.request.get('/auth/me', { headers });
  }
}
