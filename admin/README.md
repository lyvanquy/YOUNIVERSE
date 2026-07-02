# YOUniverse Admin

React Vite admin dashboard chạy độc lập với website public.

## Setup

```bash
cd admin
npm install
cp .env.example .env
npm run dev
```

Admin mặc định đọc backend tại:

```txt
VITE_API_URL=http://localhost:4000/api/v1
```

Seed backend hiện có tài khoản admin:

```txt
email: admin@youniverse.local
password: Admin123456
```

## Modules

- Auth: login thật qua backend, guard role `ADMIN`
- Dashboard: KPI và recent orders
- Products: list, filter, create, edit, archive, upload image
- Orders: list, filter, detail, update status, confirm bank transfer
- Inventory: list, low stock filter, import/export/adjustment
- Coupons: list, create, edit, disable
- Users: read-only list
- Feedbacks: list, search, delete
- Settings: thông tin vận hành admin app
