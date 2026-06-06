# Backend 04. API Spec

Base URL:

```txt
/api/v1
```

Response success:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

Response error:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```

## 1. Auth API

### POST `/auth/register`

Body:

```json
{
  "fullName": "Nguyen Van A",
  "email": "a@example.com",
  "phone": "0900000000",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

Response:

```json
{
  "user": {
    "id": "cuid",
    "fullName": "Nguyen Van A",
    "email": "a@example.com",
    "role": "CUSTOMER"
  },
  "accessToken": "jwt"
}
```

### POST `/auth/login`

Body:

```json
{
  "email": "a@example.com",
  "password": "Password123"
}
```

### GET `/auth/me`

Headers:

```txt
Authorization: Bearer token
```

### POST `/auth/logout`

Optional if using refresh token.

## 2. Products API

### GET `/products`

Query:

```txt
?page=1&limit=12&search=&line=ASTRA&category=&sort=newest
```

Response data:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 30,
    "totalPages": 3
  }
}
```

### GET `/products/:slug`

Return full product detail.

### GET `/products/featured`

For home carousel/featured products.

## 3. Categories API

### GET `/categories`

Return active categories.

## 4. Cart API

### GET `/cart`

Headers:

- Optional Authorization
- Optional `x-session-id` for guest

### POST `/cart/items`

Body:

```json
{
  "productId": "product_id",
  "variantId": null,
  "quantity": 1,
  "customText": "My universe",
  "customData": {
    "symbol": "star"
  }
}
```

Rules:

- Product must be ACTIVE.
- Quantity must be <= stock.

### PATCH `/cart/items/:itemId`

Body:

```json
{
  "quantity": 2
}
```

### DELETE `/cart/items/:itemId`

### POST `/cart/apply-coupon`

Body:

```json
{
  "code": "WELCOME10"
}
```

### POST `/cart/merge`

When user logs in.

Body:

```json
{
  "sessionId": "guest-session-id"
}
```

## 5. Checkout API

### POST `/checkout/validate`

Validates:

- cart not empty
- stock available
- coupon valid
- customer info valid

### POST `/checkout/create-order`

Body:

```json
{
  "cartId": "cart_id",
  "customer": {
    "fullName": "Nguyen Van A",
    "email": "a@example.com",
    "phone": "0900000000"
  },
  "shipping": {
    "addressLine": "279 Nguyen Tri Phuong",
    "ward": "Vuon Lai",
    "district": "HCMC",
    "province": "HCMC"
  },
  "paymentProvider": "VNPAY",
  "couponCode": "WELCOME10",
  "note": "Giao giờ hành chính"
}
```

Response for online payment:

```json
{
  "orderCode": "YOU-20260605-ABC123",
  "paymentProvider": "VNPAY",
  "paymentUrl": "https://..."
}
```

Response for COD:

```json
{
  "orderCode": "YOU-20260605-ABC123",
  "redirectUrl": "/order-success?orderCode=YOU-20260605-ABC123"
}
```

## 6. Payment API

Development online provider:

```txt
MOCK_ONLINE
```

Use `MOCK_ONLINE` in checkout to test online payment without real VNPay/MoMo/Stripe credentials.

### POST `/payments/create`

Usually called internally from checkout, but can expose for retry payment.

### GET `/payments/callback/:provider`

For redirect callback if provider uses GET.

Mock provider callback path:

```txt
GET /payments/callback/mock-online
```

### POST `/payments/webhook/:provider`

For server webhook.

Mock provider webhook path:

```txt
POST /payments/webhook/mock-online
```

Rules:

- Must verify provider signature.
- Must be idempotent.
- Same callback repeated should not duplicate email/inventory deduction.
- Amount from provider must match order total.

## 7. Orders API for customer

### GET `/orders/me`

Auth required.

### GET `/orders/me/:id`

Auth required.

### POST `/orders/:id/cancel`

Allowed only when:

- user owns order
- status is PENDING_PAYMENT, PAID, CONFIRMED tùy policy
- not shipping/completed

## 8. Admin API

All require role ADMIN.

### GET `/admin/dashboard`

Returns:

```json
{
  "revenue": 1000000,
  "totalOrders": 10,
  "pendingOrders": 3,
  "lowStockProducts": 2,
  "newCustomers": 5,
  "recentOrders": []
}
```

### GET `/admin/products`

### POST `/admin/products`

### GET `/admin/products/:id`

### PATCH `/admin/products/:id`

### DELETE `/admin/products/:id`

Soft delete by setting status `ARCHIVED`.

### GET `/admin/orders`

Query:

```txt
?status=&paymentStatus=&search=&from=&to=&page=1&limit=20
```

### GET `/admin/orders/:id`

### PATCH `/admin/orders/:id/status`

Body:

```json
{
  "status": "PROCESSING",
  "note": "Đang đóng gói"
}
```

### GET `/admin/inventory`

### PATCH `/admin/inventory/:productId/adjust`

Body:

```json
{
  "quantity": 10,
  "type": "IMPORT",
  "note": "Nhập hàng mới"
}
```

### GET `/admin/coupons`

### POST `/admin/coupons`

### PATCH `/admin/coupons/:id`

### DELETE `/admin/coupons/:id`

Set inactive, not hard delete.

### GET `/admin/users`
