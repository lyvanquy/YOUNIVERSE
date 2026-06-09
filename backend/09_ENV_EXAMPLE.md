# Backend 09. Environment Example

Create file:

```txt
backend/.env
```

Content:

```env
NODE_ENV=development
PORT=4000

DATABASE_URL="postgresql://postgres:password@localhost:5432/youniverse_db?schema=public"

JWT_SECRET="change_this_secret"
JWT_EXPIRES_IN="1d"

FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:4000"

EMAIL_FROM_NAME="YOUniverse"
EMAIL_FROM_ADDRESS="no-reply@youniverse.local"
EMAIL_SMTP_HOST=""
EMAIL_SMTP_PORT="587"
EMAIL_SMTP_USER=""
EMAIL_SMTP_PASSWORD=""

PAYMENT_RETURN_URL="http://localhost:3000/payment-result"
PAYMENT_WEBHOOK_SECRET="change_this_secret"

VNPAY_TMN_CODE=""
VNPAY_HASH_SECRET=""
VNPAY_URL=""

MOMO_PARTNER_CODE=""
MOMO_ACCESS_KEY=""
MOMO_SECRET_KEY=""
MOMO_ENDPOINT=""

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

## Important

- Never commit real `.env`.
- Commit only `.env.example`.
- Frontend must not access backend secrets.
