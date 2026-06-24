type QueryValue = string | number | boolean | null | undefined;

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | object | null;
  auth?: boolean;
  token?: string;
  query?: Record<string, QueryValue>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';
export const AUTH_EVENT = 'rutasingluten-auth-change';

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1';
  const normalizedBase = API_BASE_URL.startsWith('http')
    ? API_BASE_URL
    : new URL(API_BASE_URL, origin).toString();
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(normalizedPath, `${normalizedBase.replace(/\/$/, '')}/`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export function buildAssetUrl(path: string) {
  if (!path) {
    return path;
  }

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1';
  const normalizedBase = API_BASE_URL.startsWith('http')
    ? API_BASE_URL
    : new URL(API_BASE_URL, origin).toString();

  return new URL(path.startsWith('/') ? path.slice(1) : path, `${normalizedBase.replace(/\/$/, '')}/`).toString();
}

function getClientToken(explicitToken?: string) {
  if (explicitToken) {
    return explicitToken;
  }

  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.localStorage.getItem('rutasingluten_token') ?? undefined;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth, token, query, headers, body, ...rest } = options;
  const resolvedHeaders = new Headers(headers);
  const resolvedToken = auth ? getClientToken(token) : undefined;

  if (resolvedToken) {
    resolvedHeaders.set('Authorization', `Bearer ${resolvedToken}`);
  }

  let resolvedBody: BodyInit | undefined;

  if (body instanceof FormData) {
    resolvedBody = body;
  } else if (body && typeof body === 'object') {
    resolvedHeaders.set('Content-Type', 'application/json');
    resolvedBody = JSON.stringify(body);
  } else if (typeof body === 'string') {
    resolvedHeaders.set('Content-Type', 'application/json');
    resolvedBody = body;
  }

  const response = await fetch(buildUrl(path, query), {
    ...rest,
    headers: resolvedHeaders,
    body: resolvedBody,
    cache: 'no-store',
  });

  const responseText = response.status === 204 ? '' : await response.text();

  if (!response.ok) {
    let message = 'No se pudo completar la solicitud.';

    try {
      const payload = JSON.parse(responseText) as { message?: string | string[] };

      if (Array.isArray(payload.message)) {
        message = payload.message.join(', ');
      } else if (payload.message) {
        message = payload.message;
      }
    } catch {
      if (responseText) {
        message = responseText;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return responseText ? (JSON.parse(responseText) as T) : (undefined as T);
}

export function saveAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('rutasingluten_token', token);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT));
  }
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('rutasingluten_token');
    window.dispatchEvent(new CustomEvent(AUTH_EVENT));
  }
}
