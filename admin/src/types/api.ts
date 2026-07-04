export type UserRole = "CUSTOMER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";
export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type ProductLine = "ASTRA" | "SIRIUS" | "POLARIS";
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";
export type PaymentProvider = "COD" | "BANK_TRANSFER";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
export type CouponType = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
export type InventoryChangeType = "IMPORT" | "EXPORT" | "SALE" | "CANCEL_RETURN" | "ADJUSTMENT";

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  name: string;
  slug: string;
  productLine: ProductLine;
  badge: string | null;
  shortDescription: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  sku: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  allowCustomize: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  images: Array<{ id?: string; url: string; alt: string | null; sortOrder?: number; isPrimary: boolean }>;
  inventory: {
    quantity: number;
    reservedQuantity?: number;
    soldQuantity?: number;
    lowStockThreshold: number;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductListData = {
  items: Product[];
  pagination: Pagination;
};

export type OrderSummary = {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus | null;
  paymentProvider: PaymentProvider | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderDetail = OrderSummary & {
  user: Pick<AuthUser, "id" | "fullName" | "email" | "phone" | "role" | "status"> | null;
  coupon: { id: string; code: string; name: string } | null;
  shippingAddress: string;
  note: string | null;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  adminNote: string | null;
  trackingCode: string | null;
  items: Array<{
    id: string;
    productId: string;
    variantId: string | null;
    productName: string;
    variantName: string | null;
    sku: string | null;
    imageUrl: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    customText: string | null;
    customData: unknown;
  }>;
  payments: Array<{
    id: string;
    provider: PaymentProvider;
    status: PaymentStatus;
    amount: number;
    currency: string;
    providerTxnId: string | null;
    receiptUrl?: string | null;
    paidAt: string | null;
    failedReason: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  inventoryLogs: Array<{
    id: string;
    inventoryId: string;
    type: InventoryChangeType;
    quantity: number;
    note: string | null;
    createdById: string | null;
    createdAt: string;
  }>;
};

export type InventoryItem = {
  id: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    productLine: ProductLine;
    status: ProductStatus;
    imageUrl: string | null;
  };
  logs: Array<{
    id: string;
    type: InventoryChangeType;
    quantity: number;
    note: string | null;
    orderId: string | null;
    createdById: string | null;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: CouponType;
  value: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usagePerUser: number | null;
  usedCount: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaymentSetting = {
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

export type Feedback = {
  id: string;
  fullName: string;
  email: string;
  message: string;
  createdAt: string;
};
