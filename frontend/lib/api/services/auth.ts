import { apiFetch } from '../client';
import type { AuthResponse } from '@/lib/types';

export function register(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'USER' | 'SELLER';
}) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function login(payload: { email: string; password: string }) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function getMe() {
  return apiFetch<AuthResponse['user']>('/auth/me', {
    auth: true,
  });
}
