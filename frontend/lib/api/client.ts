type QueryValue = string | number | boolean | null | undefined;

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | object | null;
  auth?: boolean;
  token?: string;
  query?: Record<string, QueryValue>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4101';

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path, API_BASE_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
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

  if (!response.ok) {
    let message = 'No se pudo completar la solicitud.';

    try {
      const payload = (await response.json()) as { message?: string | string[] };

      if (Array.isArray(payload.message)) {
        message = payload.message.join(', ');
      } else if (payload.message) {
        message = payload.message;
      }
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function saveAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('rutasingluten_token', token);
  }
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('rutasingluten_token');
  }
}
