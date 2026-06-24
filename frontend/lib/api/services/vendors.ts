import { apiFetch } from '../client';
import type { SellerProfile } from '@/lib/types';

export function getSellerProfile() {
  return apiFetch<SellerProfile | null>('/sellers/me', {
    auth: true,
  });
}

export function createSellerProfile(payload: Record<string, unknown>) {
  return apiFetch('/sellers/profile', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}

export function updateSellerProfile(payload: Record<string, unknown>) {
  return apiFetch('/sellers/profile', {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
}

export function createMainLocation(payload: Record<string, unknown>) {
  return apiFetch('/sellers/main-location', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}

export function createDeliveryPoint(payload: Record<string, unknown>) {
  return apiFetch('/sellers/delivery-points', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}

export function deleteDeliveryPoint(id: string) {
  return apiFetch(`/sellers/delivery-points/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

export function createShippingArea(payload: Record<string, unknown>) {
  return apiFetch('/sellers/shipping-areas', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}
