# Backend 01. Backend Structure

## 1. Tech stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod
- Nodemailer hoặc email provider
- Payment provider adapters

## 2. Module structure

Mỗi module nên theo format:

```txt
module/
├── module.routes.ts
├── module.controller.ts
├── module.service.ts
├── module.validation.ts
└── module.types.ts
```

Ví dụ:

```txt
auth/
├── auth.routes.ts
├── auth.controller.ts
├── auth.service.ts
├── auth.validation.ts
└── auth.types.ts
```

## 3. Common files

```txt
common/
├── middlewares/
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   ├── error.middleware.ts
│   └── validate.middleware.ts
├── utils/
│   ├── hash.ts
│   ├── jwt.ts
│   ├── slug.ts
│   ├── money.ts
│   └── response.ts
├── errors/
│   ├── AppError.ts
│   └── errorCodes.ts
└── types/
    └── express.d.ts
```

## 4. Controllers

Controller chỉ xử lý:

- Nhận request
- Validate đã qua middleware
- Gọi service
- Trả response

Không viết business logic trong controller.

## 5. Services

Service xử lý:

- Business logic
- Prisma transaction
- Payment logic
- Email trigger
- Inventory update

## 6. Middleware bắt buộc

### `authMiddleware`

- Lấy Bearer token
- Verify JWT
- Attach `req.user`

### `roleMiddleware`

- Kiểm tra role
- Ví dụ chỉ admin được vào `/admin`

### `validateMiddleware`

- Validate body/query/params bằng Zod

### `errorMiddleware`

- Bắt lỗi tập trung
- Trả JSON chuẩn

## 7. Prisma

Dùng singleton Prisma client:

```ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

## 8. Transaction

Các luồng phải dùng transaction:

- Checkout tạo order + order items + payment
- Payment success cập nhật order + inventory + transaction
- Cancel order hoàn kho
- Apply coupon usage

## 9. Security

- Hash password bằng bcrypt
- JWT secret trong env
- CORS theo domain frontend
- Rate limit auth
- Không trả password hash
- Validate toàn bộ input
- Verify payment webhook/callback
