import { apiFetch } from '../client';
import type { SuggestionItem, VerificationItem } from '@/lib/types';

export function getPendingVerifications() {
  return apiFetch<VerificationItem[]>('/admin/verification/pending', {
    auth: true,
  });
}

export function reviewVerification(id: string, payload: { status: string; notes?: string }) {
  return apiFetch(`/admin/verification/${id}`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
}

export function getPendingSuggestions() {
  return apiFetch<SuggestionItem[]>('/admin/suggestions/pending', {
    auth: true,
  });
}

export function reviewSuggestion(id: string, payload: { status: string }) {
  return apiFetch(`/admin/suggestions/${id}`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
}
