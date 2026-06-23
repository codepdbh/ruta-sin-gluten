import { apiFetch } from "../client";
import type { AuthResponse } from "@/lib/types";

export function register(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatarUrl?: string;
  businessName?: string;
  logoUrl?: string;
  businessType?:
    | "TIENDA"
    | "EMPRENDIMIENTO"
    | "PANADERIA"
    | "CAFETERIA"
    | "RESTAURANTE"
    | "OTRO";
  country?: string;
  department?: string;
  city?: string;
  whatsapp?: string;
  description?: string;
  hasPhysicalStore?: boolean;
  hasShipping?: boolean;
  mainLocation?: {
    addressText: string;
    reference?: string;
    lat?: number;
    lng?: number;
  };
  deliveryPoints?: Array<{
    name: string;
    addressText: string;
    reference?: string;
    schedule?: string;
    lat: number;
    lng: number;
  }>;
  role?: "USER" | "SELLER";
}) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function login(payload: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function requestPasswordReset(payload: { email: string }) {
  return apiFetch<{ message: string }>("/auth/password/forgot", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: { token: string; password: string }) {
  return apiFetch<{ message: string }>("/auth/password/reset", {
    method: "POST",
    body: payload,
  });
}

export function getMe() {
  return apiFetch<AuthResponse["user"]>("/auth/me", {
    auth: true,
  });
}

export function confirmEmailVerification(token: string) {
  return apiFetch<{ message: string }>("/auth/email-verification/confirm", {
    method: "POST",
    body: { token },
  });
}

export function resendEmailVerification() {
  return apiFetch<{ message: string; emailVerificationSent: boolean }>(
    "/auth/email-verification/resend",
    {
      method: "POST",
      auth: true,
    },
  );
}
