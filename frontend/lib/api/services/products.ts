import { apiFetch } from "../client";
import type { Product } from "@/lib/types";

export function listProducts(
  query: Record<string, string | number | boolean | undefined>,
) {
  return apiFetch<{
    items: Product[];
    pagination: { page: number; total: number; totalPages: number };
  }>("/products", { query });
}

export function listMyProducts(
  query: Record<string, string | number | boolean | undefined>,
) {
  return apiFetch<{
    items: Product[];
    pagination: { page: number; total: number; totalPages: number };
  }>("/products/mine", { query, auth: true });
}

export function getProduct(id: string) {
  return apiFetch<Product>(`/products/${id}`);
}

export function createProduct(payload: Record<string, unknown>) {
  return apiFetch("/products", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export function updateProduct(id: string, payload: Record<string, unknown>) {
  return apiFetch(`/products/${id}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
}

export function deleteProduct(id: string) {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
