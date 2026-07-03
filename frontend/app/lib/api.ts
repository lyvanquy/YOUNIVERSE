export type ApiUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  productLine: "ASTRA" | "SIRIUS" | "POLARIS";
  badge: string | null;
  shortDescription: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  sku: string | null;
  images: Array<{
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }>;
  inventory: {
    quantity: number;
    lowStockThreshold?: number;
  } | null;
};

export type ApiOrder = {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    totalPrice: number;
  }>;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
};

export class ApiError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(message: string, statusCode: number, errors?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1").replace(/\/$/, "");

export const AUTH_TOKEN_KEY = "youniverse_access_token";
export const USER_KEY = "youniverse_user";

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getSessionId() {
  if (typeof window === "undefined") return "server";

  const key = "youniverse_session_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  localStorage.setItem(key, sessionId);
  return sessionId;
}

export function buildQuery(params: Record<string, string | number | boolean | null | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export async function apiRequest<T>(
  path: string,
  options: Omit<RequestInit, "body"> & {
    body?: unknown;
    token?: string | null;
    sessionId?: string | null;
  } = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  if (options.sessionId) {
    headers.set("x-session-id", options.sessionId);
  }

  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body,
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    throw new ApiError(payload?.message ?? "Request failed", response.status, payload?.errors);
  }

  return (payload?.data ?? payload) as T;
}

export const productLineToApi = (line: "all" | "astra" | "sirius" | "polaris") => {
  if (line === "all") return undefined;
  return line.toUpperCase();
};
