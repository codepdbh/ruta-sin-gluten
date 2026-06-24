import { apiFetch } from "../client";
import type {
  AdminBusinessItem,
  AdminUserItem,
  SuggestionItem,
  VerificationItem,
} from "@/lib/types";

export function getAdminUsers() {
  return apiFetch<AdminUserItem[]>("/admin/users", {
    auth: true,
  });
}

export function deleteAdminUser(id: string) {
  return apiFetch<{
    id: string;
    name: string;
    email: string;
    role: string;
    businessName?: string | null;
    deleted: boolean;
  }>(`/admin/users/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export function getAdminBusinesses() {
  return apiFetch<AdminBusinessItem[]>("/admin/businesses", {
    auth: true,
  });
}

export function deleteAdminBusiness(id: string) {
  return apiFetch<{ id: string; businessName: string; deleted: boolean }>(
    `/admin/businesses/${id}`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}

export function getPendingVerifications() {
  return apiFetch<VerificationItem[]>("/admin/verification/pending", {
    auth: true,
  });
}

export function reviewVerification(
  id: string,
  payload: { status: string; notes?: string },
) {
  return apiFetch(`/admin/verification/${id}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
}

export function getPendingSuggestions() {
  return apiFetch<SuggestionItem[]>("/admin/suggestions/pending", {
    auth: true,
  });
}

export function reviewSuggestion(id: string, payload: { status: string }) {
  return apiFetch(`/admin/suggestions/${id}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
}
