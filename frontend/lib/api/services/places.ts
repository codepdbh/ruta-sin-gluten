import { apiFetch } from "../client";
import type { PlaceDetail, PlaceRating, PlaceSummary } from "@/lib/types";

export function getPlacesInBounds(
  query: Record<string, string | number | boolean | undefined>,
) {
  return apiFetch<PlaceSummary[]>("/places/in-bounds", {
    query,
  });
}

export function getPlacesNearby(
  query: Record<string, string | number | boolean | undefined>,
) {
  return apiFetch<PlaceSummary[]>("/places/nearby", {
    query,
  });
}

export function getPlace(id: string) {
  return apiFetch<PlaceDetail>(`/places/${id}`);
}

export function getMyPlaceRating(id: string) {
  return apiFetch<{ rating: PlaceRating | null }>(`/places/${id}/rating/me`, {
    auth: true,
  });
}

export function ratePlace(
  id: string,
  payload: { score: number; comment?: string },
) {
  return apiFetch<{
    rating: PlaceRating;
    ratingAverage: number;
    ratingCount: number;
  }>(`/places/${id}/rating`, {
    method: "POST",
    auth: true,
    body: payload,
  });
}
