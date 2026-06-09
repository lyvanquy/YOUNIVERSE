# Backend 07. Email Spec

## 1. Email service

Create email module:

```txt
emails/
├── email.service.ts
├── email.templates.ts
└── email.types.ts
```

## 2. Email triggers

### Order confirmation

Trigger when:

- COD order created successfully
- Online payment success verified

Subject:

```txt
YOUniverse xác nhận đơn hàng #{orderCode}
```

### Payment success

Subject:

```txt
Thanh toán thành công cho đơn hàng #{orderCode}
```

### Order status updated

Subject:

```txt
Đơn hàng #{orderCode} đã được cập nhật trạng thái
```

### Payment failed optional

Subject:

```txt
Thanh toán đơn hàng #{orderCode} chưa thành công
```

## 3. Order confirmation content

Must include:

- Logo/brand text
- Slogan
- Greeting customer name
- Order code
- Order date
- Product list
- Subtotal
- Discount
- Shipping fee
- Total
- Payment method
- Payment status
- Shipping address
- Link view order
- Contact/social links

## 4. Template tone

Tone:

- Trẻ trung
- Thân thiện
- Không quá dài
- Đúng brand vũ trụ

Example opening:

```txt
Cảm ơn bạn đã tạo nên một vũ trụ nhỏ cùng YOUniverse.
```

## 5. EmailLog

Every send should create EmailLog:

- toEmail
- subject
- template
- status: SENT/FAILED
- error

## 6. SMTP env

```txt
EMAIL_FROM_NAME="YOUniverse"
EMAIL_FROM_ADDRESS="no-reply@youniverse.local"
EMAIL_SMTP_HOST=
EMAIL_SMTP_PORT=
EMAIL_SMTP_USER=
EMAIL_SMTP_PASSWORD=
```

## 7. Development mode

In development:

- Log email preview to console if SMTP not configured.
- Do not crash checkout if email fails.
- Save EmailLog failed status.

## 8. Implementation notes

Current backend implementation:

- Email service lives in `backend/src/modules/emails`.
- COD checkout sends `ORDER_CONFIRMATION`.
- Online payment success sends `PAYMENT_SUCCESS`.
- `ORDER_STATUS_UPDATED` template/service is available for admin status update APIs.
- Development/test without SMTP uses console fallback and writes `EmailLog` as `SENT`.
- Production without SMTP writes `EmailLog` as `FAILED`.
- Email send failures are caught inside the email service and do not fail checkout or payment callback.
