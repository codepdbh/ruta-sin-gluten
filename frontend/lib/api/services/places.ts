import { apiFetch } from '../client';
import type { PlaceDetail, PlaceSummary } from '@/lib/types';

export function getPlacesInBounds(query: Record<string, string | number | boolean | undefined>) {
  return apiFetch<PlaceSummary[]>('/places/in-bounds', {
    query,
  });
}

export function getPlacesNearby(query: Record<string, string | number | boolean | undefined>) {
  return apiFetch<PlaceSummary[]>('/places/nearby', {
    query,
  });
}

export function getPlace(id: string) {
  return apiFetch<PlaceDetail>(`/places/${id}`);
}
