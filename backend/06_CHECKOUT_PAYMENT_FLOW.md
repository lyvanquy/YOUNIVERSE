# Backend 06. Checkout and Payment Flow

## 1. Checkout main flow

```txt
Frontend checkout form
  ↓
POST /checkout/validate
  ↓
POST /checkout/create-order
  ↓
Backend transaction:
    - validate cart
    - validate stock
    - validate coupon
    - create order
    - create order items
    - create payment transaction
  ↓
If COD:
    - order status CONFIRMED
    - payment status PENDING
    - send order confirmation email
  ↓
If online:
    - order status PENDING_PAYMENT
    - payment status PENDING
    - return paymentUrl
```

## 2. Payment success flow

```txt
Provider callback/webhook
  ↓
Verify signature
  ↓
Find payment transaction
  ↓
If already PAID: return OK
  ↓
Update transaction PAID
  ↓
Update order PAID/CONFIRMED
  ↓
Deduct inventory
  ↓
Mark coupon usage
  ↓
Send email confirmation/payment success
```

## 3. Payment failed flow

```txt
Provider callback/webhook failed
  ↓
Verify signature
  ↓
Update transaction FAILED
  ↓
Keep order PENDING_PAYMENT or CANCELLED based on policy
  ↓
Frontend shows payment failed
```

## 4. COD flow

For COD:

- Create order with status `CONFIRMED`
- Payment transaction:
  - provider COD
  - status PENDING
- Deduct inventory immediately or when admin moves to PROCESSING.
- Recommended simple approach: deduct when order is CONFIRMED.

## 5. Idempotency

Payment callback may be called multiple times. Must avoid:

- Duplicate stock deduction
- Duplicate email
- Duplicate coupon usage

Implementation rule:

```txt
If PaymentTransaction.status is already PAID, return success without repeating side effects.
```

## 6. Provider adapters

Folder:

```txt
payments/providers/
├── payment-provider.interface.ts
├── cod.provider.ts
├── vnpay.provider.ts
├── momo.provider.ts
└── stripe.provider.ts
```

Interface:

```ts
export interface CreatePaymentInput {
  orderId: string;
  orderCode: string;
  amount: number;
  currency: string;
  returnUrl: string;
  ipAddress?: string;
}

export interface CreatePaymentResult {
  provider: string;
  paymentUrl?: string;
  providerTxnId?: string;
  rawResponse?: unknown;
}

export interface VerifyPaymentResult {
  success: boolean;
  providerTxnId?: string;
  amount?: number;
  orderCode?: string;
  rawPayload?: unknown;
  message?: string;
}
```

## 7. Frontend payment result

After provider redirects back:

```txt
/payment-result?orderCode=...&status=success
```

Or directly:

```txt
/order-success?orderCode=...
```

## 8. Security

- Verify signature/hmac for provider callback.
- Do not trust amount/order status from frontend.
- Backend recalculates total from cart.
- Amount paid must match order total.
