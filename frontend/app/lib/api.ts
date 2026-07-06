export type ApiUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  address: string | null;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiProduct = {
  id: string;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
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
    id?: string;
    url: string;
    alt: string | null;
    sortOrder?: number;
    isPrimary: boolean;
  }>;
  inventory: {
    quantity: number;
    reservedQuantity?: number;
    soldQuantity?: number;
    lowStockThreshold?: number;
  } | null;
  status?: string;
  isFeatured?: boolean;
  allowCustomize?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductListData = {
  items: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductDetailData = {
  product: ApiProduct;
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

export type ApiPaymentSetting = {
  codEnabled: boolean;
  bankTransferEnabled: boolean;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankBranch: string | null;
  bankTransferQrImageUrl: string | null;
  bankTransferNote: string | null;
  createdAt: string;
  updatedAt: string;
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

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export const API_BASE_URL = (
  typeof window === "undefined"
    ? process.env.API_INTERNAL_URL ?? publicApiUrl
    : publicApiUrl
).replace(/\/$/, "");

export const AUTH_SESSION_HINT_KEY = "youniverse_session_name";

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

type NextFetchOptions = Omit<RequestInit, "body"> & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export async function apiRequest<T>(
  path: string,
  options: NextFetchOptions & {
    body?: unknown;
    sessionId?: string | null;
  } = {},
): Promise<T> {
  const { body: rawBody, sessionId, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers);
  if (["/auth/login", "/auth/register", "/auth/google"].includes(path)) {
    headers.set("x-auth-client", "storefront");
  }

  if (sessionId) {
    headers.set("x-session-id", sessionId);
  }

  let body: BodyInit | undefined;
  if (rawBody instanceof FormData) {
    body = rawBody;
  } else if (rawBody !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(rawBody);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    credentials: requestOptions.credentials ?? "include",
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

export type ShowcaseVariant = {
  id: string;
  name: string;
  sku: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  description: string | null;
  group: string | null;
  groupEmoji: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type ShowcaseProduct = ApiProduct & {
  variants: ShowcaseVariant[];
  sortOrder: number;
};

export type ShowcaseData = {
  items: ShowcaseProduct[];
};
