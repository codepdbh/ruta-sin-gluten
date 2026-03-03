import { apiFetch } from '../client';

export function createSuggestion(payload: Record<string, unknown>) {
  return apiFetch('/suggestions', {
    method: 'POST',
    body: payload,
  });
}
