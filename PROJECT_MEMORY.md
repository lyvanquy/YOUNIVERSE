# 🌌 YOUniverse — Project Memory (Ghi nhớ xuyên suốt dự án)

> **Slogan:** *"A galaxy to hold, a story to be told"*
> **Website Production:** https://youniverse.io.vn
> **Loại dự án:** E-commerce bán phụ kiện charm cá nhân hóa
> **Repository:** Monorepo chứa 4 app (Backend, Frontend, Admin, Mobile)

---

## 📐 Kiến trúc tổng quan

```
web-shop/
├── backend/     → Express API (Port 4000)
├── frontend/    → Next.js App Router - Giao diện khách hàng (Port 3000)
├── admin/       → React + Vite - Trang quản trị (Port 5173)
├── mobile/      → React Native + Expo - Ứng dụng di động
├── image-app/   → Ứng dụng xử lý ảnh (chứa ảnh sản phẩm demo)
├── deploy/      → Cấu hình nginx
├── docs/        → Tài liệu dự án đầy đủ (00 → 13)
└── docker-compose.yml → Orchestrate toàn bộ hệ thống
```

### Luồng kết nối
```
[Mobile App] ──┐
[Frontend]  ───┤──→ [Backend API :4000] ──→ [PostgreSQL]
[Admin]     ───┘        ↓
                   [Nodemailer → SMTP]
```

---

## 🛠️ Tech Stack chi tiết

### Backend (`backend/`)
| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| Runtime | Node.js + TypeScript | tsx (hot reload) |
| Framework | Express | ^4.21.2 |
| ORM | Prisma Client | ^6.0.1 |
| Database | PostgreSQL | 15-alpine (Docker) |
| Auth | JWT + bcrypt | jsonwebtoken ^9.0.2 |
| Validation | Zod | ^3.24.1 |
| Upload | Multer | ^2.2.0 |
| Email | Nodemailer | ^6.9.16 |
| Security | Helmet, express-rate-limit, CORS | - |

### Frontend (`frontend/`)
| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.7 |
| React | React | 19.2.4 |
| Styling | **Tailwind CSS v4** | ^4 |
| Icons | Lucide React | ^0.546.0 |
| Output | `standalone` (Docker optimized) | - |

### Admin (`admin/`)
| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| Build Tool | Vite | ^7.2.7 |
| Framework | React | ^19.2.4 |
| Routing | React Router DOM | ^7.11.0 |
| Data Fetching | TanStack React Query | ^5.90.12 |
| Charts | Recharts | ^3.6.0 |
| Validation | Zod | ^4.2.1 |
| Icons | Lucide React | ^0.546.0 |

### Mobile (`mobile/`)
| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| Framework | Expo | ~54.0.0 |
| React Native | React Native | 0.81.5 |
| Navigation | Expo Router | ~6.0.24 |
| State | Zustand | ^5.0.14 |
| HTTP | Axios | ^1.18.1 |
| Icons | Lucide React Native | ^1.23.0 |

---

## 🌐 Port Mapping (Development)

| Service | URL | Ghi chú |
|---|---|---|
| Frontend | http://localhost:3000 | Next.js App Router |
| Backend API | http://localhost:4000 | Base route: `/api/v1` |
| Admin | http://localhost:5173 | Vite dev server |
| Prisma Studio | http://localhost:5555 | `npm run prisma:studio` |
| Mobile | Expo dev server | `expo start` |

### Port Mapping (Docker Production)
| Service | Bind | Ghi chú |
|---|---|---|
| Frontend | 127.0.0.1:3000 | Qua nginx reverse proxy |
| Backend | 127.0.0.1:4000 | Qua nginx reverse proxy |
| Admin | 127.0.0.1:8080 | Static files qua nginx |
| PostgreSQL | Không public | Chỉ internal network |

---

## 🗄️ Database Schema (Prisma) — Bảng tóm tắt

### Enums quan trọng
| Enum | Giá trị |
|---|---|
| `UserRole` | `CUSTOMER`, `ADMIN` |
| `UserStatus` | `ACTIVE`, `INACTIVE`, `BANNED` |
| `ProductStatus` | `DRAFT`, `ACTIVE`, `INACTIVE`, `ARCHIVED` |
| `ProductLine` | `ASTRA`, `SIRIUS`, `POLARIS` |
| `OrderStatus` | `PENDING_PAYMENT` → `PAID` → `CONFIRMED` → `PROCESSING` → `SHIPPING` → `COMPLETED` / `CANCELLED` / `REFUNDED` |
| `PaymentProvider` | `COD`, `BANK_TRANSFER` |
| `PaymentStatus` | `PENDING`, `PAID`, `FAILED`, `CANCELLED`, `REFUNDED` |
| `CouponType` | `PERCENTAGE`, `FIXED_AMOUNT`, `FREE_SHIPPING` |
| `CartStatus` | `ACTIVE`, `CHECKED_OUT`, `ABANDONED` |

### Bảng chính & quan hệ
```
User ──< Address ──< Order
User ──< Cart ──< CartItem >── Product
User ──< CouponUsage >── Coupon
Product ──< ProductImage
Product ──< ProductVariant ──< CartItem, OrderItem
Product ── Inventory ──< InventoryLog
Order ──< OrderItem >── Product, ProductVariant
Order ──< PaymentTransaction
Order ──< InventoryLog
Order >── Coupon
Feedback (standalone)
EmailLog (standalone)
PaymentSetting (singleton, id="default")
```

### Lưu ý quan trọng về DB
- **ID format:** `cuid()` (không phải UUID hay auto-increment)
- **Decimal:** Dùng `Decimal(12,2)` cho tất cả giá tiền (VND)
- **CartItem unique:** `@@unique([cartId, productId, variantId, customText])` — combo sản phẩm + variant + custom text
- **PaymentSetting:** Singleton record với `id = "default"`
- **User.tokenVersion:** Dùng để invalidate JWT khi cần

---

## 🔗 API Routes (Backend)

| Prefix | Module | Mô tả |
|---|---|---|
| `/api/v1/auth` | auth | Đăng ký, đăng nhập, Google OAuth, me |
| `/api/v1/products` | products | CRUD sản phẩm (public: list, detail) |
| `/api/v1/categories` | categories | CRUD danh mục |
| `/api/v1/cart` | cart | Giỏ hàng (session-based hoặc user-based) |
| `/api/v1/checkout` | checkout | Tạo đơn hàng từ giỏ hàng |
| `/api/v1/orders` | orders | Xem đơn hàng (khách hàng) |
| `/api/v1/payments` | payments | Xử lý thanh toán (COD, bank transfer) |
| `/api/v1/feedback` | feedback | Gửi feedback |
| `/api/v1/upload` | upload | Upload ảnh (Multer) |
| `/api/v1/settings` | settings | Cấu hình thanh toán |
| `/api/v1/admin/*` | admin | Tất cả API quản trị (cần JWT admin) |
| `/api/v1/health` | health | Health check |
| `/uploads/*` | static | Serve file ảnh đã upload |

### Middleware stack (theo thứ tự)
1. `helmet` (security headers, cross-origin resource policy)
2. `cors` (configured origins)
3. `express.json` (limit: 1mb)
4. `express.urlencoded`
5. `requestLogger`
6. `apiRateLimit` (chỉ cho `/api`)

---

## 📁 Cấu trúc thư mục chi tiết

### Backend
```
backend/src/
├── app.ts              → Express app setup + route mounting
├── server.ts           → Server bootstrap (listen)
├── config/
│   ├── cors.ts         → CORS whitelist
│   ├── env.ts          → Environment variables parsing (type-safe)
│   └── prisma.ts       → Prisma client singleton
├── common/
│   ├── errors/         → Custom error classes
│   ├── middlewares/     → Auth, error, rate-limit, request-logger
│   ├── types/          → Shared TypeScript types
│   └── utils/          → Helper functions
└── modules/
    ├── admin/          → Admin-only routes & controllers
    ├── auth/           → Register, login, Google OAuth
    ├── cart/           → Cart management
    ├── categories/     → Category CRUD
    ├── checkout/       → Order creation flow
    ├── emails/         → Email templates & sender
    ├── feedback/       → Customer feedback
    ├── health/         → Health check endpoint
    ├── orders/         → Order queries (customer-side)
    ├── payments/       → Payment processing
    ├── products/       → Product CRUD
    ├── settings/       → Payment settings
    └── upload/         → File upload handler
```

### Frontend
```
frontend/
├── app/
│   ├── layout.tsx          → Root layout (fonts, metadata, header/footer)
│   ├── page.tsx            → Homepage
│   ├── globals.css         → Global styles + Tailwind
│   ├── locales.ts          → Đa ngôn ngữ (i18n strings)
│   ├── data.ts             → Static data constants
│   ├── YouniverseApp.tsx   → Main app component
│   ├── (auth)/             → Auth pages (login, register)
│   ├── (public)/           → Public pages (about, cart, checkout, products, account, order-success)
│   ├── about/              → Trang giới thiệu
│   ├── account/            → Trang tài khoản
│   ├── order/              → Trang đơn hàng
│   ├── policy/             → Trang chính sách
│   ├── products/           → Trang sản phẩm
│   ├── components/         → Shared components (Header, Footer, CartDrawer, Views...)
│   └── lib/                → Utilities
├── components/             → Root-level shared components
├── lib/                    → Root-level utilities
├── store/                  → State management
├── types/                  → TypeScript definitions
└── public/                 → Static assets
```

### Admin
```
admin/src/
├── main.tsx            → Entry point
├── styles.css          → Global CSS (42KB - có design system riêng)
├── app/
│   ├── App.tsx         → Root component
│   ├── providers.tsx   → React Query + Router providers
│   └── router.tsx      → Route definitions
├── components/         → Shared UI components
├── features/
│   └── auth/           → Auth logic + route guards
├── layouts/
│   ├── AdminLayout     → Dashboard shell (sidebar + header)
│   └── AuthLayout      → Login page layout
├── lib/
│   ├── api.ts          → Axios/fetch wrapper
│   ├── format.ts       → Number/date formatters
│   └── ui.ts           → UI helpers
├── pages/              → 11 trang quản trị
│   ├── DashboardPage   → Thống kê tổng quan + biểu đồ
│   ├── ProductsPage    → Quản lý sản phẩm
│   ├── ProductFormPage → Thêm/sửa sản phẩm
│   ├── OrdersPage      → Danh sách đơn hàng
│   ├── OrderDetailPage → Chi tiết đơn hàng
│   ├── InventoryPage   → Quản lý tồn kho
│   ├── CouponsPage     → Quản lý mã giảm giá
│   ├── UsersPage       → Quản lý người dùng
│   ├── FeedbacksPage   → Xem feedback khách hàng
│   ├── SettingsPage    → Cài đặt thanh toán
│   └── LoginPage       → Đăng nhập admin
└── types/              → TypeScript definitions
```

### Mobile
```
mobile/
├── app/
│   ├── _layout.tsx     → Root layout + navigation
│   ├── (tabs)/         → Bottom tab navigation
│   ├── about.tsx       → Trang giới thiệu
│   ├── blog.tsx        → Trang blog
│   ├── checkout.tsx    → Thanh toán
│   ├── contact.tsx     → Liên hệ
│   ├── login.tsx       → Đăng nhập
│   ├── register.tsx    → Đăng ký
│   ├── order.tsx       → Đơn hàng
│   ├── policy.tsx      → Chính sách
│   └── product/        → Chi tiết sản phẩm
├── src/
│   ├── config/         → API config
│   ├── services/       → API service layer (api.ts)
│   └── store/          → Zustand stores
└── assets/             → Fonts, images
```

---

## ⚙️ Biến môi trường cần nhớ

### Root `.env` (Docker Compose)
```env
COMPOSE_PROJECT_NAME=youniverse
POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB
DATABASE_URL=postgresql://...@db:5432/...
JWT_SECRET (≥32 ký tự)
FRONTEND_URL / ADMIN_URL / BACKEND_URL
NEXT_PUBLIC_API_URL
GOOGLE_CLIENT_ID / GOOGLE_MAPS_API_KEY
EMAIL_SMTP_* (host, port, user, password)
FRONTEND_PORT / BACKEND_PORT / ADMIN_PORT
```

### Backend `.env`
```env
NODE_ENV=development
PORT=4000
TRUST_PROXY=0
DATABASE_URL="postgresql://postgres:password@localhost:5432/youniverse_db?schema=public"
JWT_SECRET (≥32 ký tự, bắt buộc ở production)
FRONTEND_URL / ADMIN_URL / BACKEND_URL
EMAIL_SMTP_*
SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (chỉ dùng khi seed)
```

### Frontend `.env`
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID=""
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
```

### Admin `.env`
```env
VITE_API_URL="http://localhost:4000/api/v1"
```

---

## 🚀 Lệnh quan trọng

### Backend
```bash
cd backend
npm install
cp .env.example .env          # Tạo file env
npx prisma migrate dev        # Chạy migration
npm run prisma:seed            # Seed data (set SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD trong .env)
npm run dev                    # Dev server :4000
npm run prisma:studio          # Mở Prisma Studio :5555
npx prisma generate            # Re-generate Prisma Client (sau khi sửa schema)
```

### Frontend
```bash
cd frontend
npm install
npm run dev                    # Dev server :3000
npm run build                  # Production build
```

### Admin
```bash
cd admin
npm install
cp .env.example .env
npm run dev                    # Dev server :5173
npm run build                  # Production build
```

### Mobile
```bash
cd mobile
npm install
npx expo start                 # Expo dev server
npx expo start --android       # Android
npx expo start --ios           # iOS
```

### Docker (Production)
```bash
cp .env.example .env           # Cấu hình env
docker compose config          # Validate
docker compose build           # Build images
docker compose up -d           # Start all
docker compose logs -f         # Xem logs
docker compose restart backend frontend admin
```

---

## 🎨 Sản phẩm — 3 dòng charm

| Dòng | Badge | Mô tả | Ví dụ |
|---|---|---|---|
| **Astra** | Unique | Cá nhân hóa: tên, chòm sao, nguyên tố | Charm khắc tên, zodiac |
| **Sirius** | Passion | Niềm vui nhỏ, thú cưng, thói quen | Charm thú cưng, sở thích |
| **Polaris** | Inspiring | Câu trích dẫn truyền cảm hứng | Charm quote, motivation |

---

## ⚠️ Quy tắc & lưu ý quan trọng

### 🔐 Bảo mật
- **KHÔNG** commit file `.env` — đã có trong `.gitignore`
- **KHÔNG** có tài khoản admin mặc định — phải set `SEED_ADMIN_EMAIL` + `SEED_ADMIN_PASSWORD` rồi chạy seed
- JWT_SECRET phải ≥ 32 ký tự ở production
- Rate limiting đã bật cho tất cả route `/api`
- Helmet đã cấu hình security headers
- CORS whitelist theo FRONTEND_URL và ADMIN_URL

### 📦 Khi thêm tính năng mới
1. Tạo module mới trong `backend/src/modules/<tên>/`
2. Tạo file: `*.routes.ts`, `*.controller.ts`, `*.service.ts` (nếu cần `*.validator.ts`)
3. Mount route trong `backend/src/app.ts`
4. Nếu cần thay đổi DB → sửa `prisma/schema.prisma` → chạy `npx prisma migrate dev --name <tên>`

### 🎨 Frontend conventions
- Tailwind CSS **v4** (quan trọng: syntax khác v3)
- App Router (KHÔNG dùng Pages Router)
- Components lớn nằm trong `app/components/` (ví dụ: HomeView, ProductsView, OrderView)
- Locales tập trung trong `app/locales.ts`
- Static data trong `app/data.ts`

### 🏢 Admin conventions
- Mỗi trang quản trị = 1 file trong `admin/src/pages/`
- API calls qua `admin/src/lib/api.ts`
- Auth guard: `RequireAdmin` (redirect → /login nếu chưa đăng nhập)
- Route definition tập trung trong `admin/src/app/router.tsx`
- Styling: CSS thuần (file `styles.css` ~42KB, có design system riêng, KHÔNG dùng Tailwind)

### 📱 Mobile conventions
- Expo Router (file-based routing)
- State management: Zustand
- API calls: Axios qua `src/services/api.ts`

### 💰 Quy tắc thanh toán
- Chỉ hỗ trợ **COD** và **BANK_TRANSFER** (không có payment gateway online)
- Bank transfer cần admin xác nhận thủ công (verifiedAt, verifiedById)
- PaymentSetting là singleton (id="default") chứa thông tin tài khoản ngân hàng

### 🔄 Quy trình đơn hàng
```
PENDING_PAYMENT → PAID → CONFIRMED → PROCESSING → SHIPPING → COMPLETED
                                                              ↘ CANCELLED
                                                              ↘ REFUNDED
```

### 📸 Upload ảnh
- Multer xử lý upload
- Lưu vào thư mục `backend/uploads/`
- Serve static tại `/uploads/*`
- Docker: mount volume `backend_uploads`

---

## 📚 Tài liệu tham khảo (trong `docs/`)

| File | Nội dung |
|---|---|
| `00_PROJECT_BRIEF.md` | Mục tiêu dự án, tinh thần thiết kế |
| `01_REQUIREMENTS_FULL.md` | Yêu cầu chức năng chi tiết |
| `02_ARCHITECTURE.md` | Kiến trúc hệ thống, ERD |
| `03_FOLDER_STRUCTURE.md` | Quy ước thư mục |
| `04_CONTENT_COPY.md` | Nội dung hiển thị đa ngôn ngữ |
| `05_ADMIN_DASHBOARD_SPEC.md` | Đặc tả admin dashboard |
| `06_CART_CHECKOUT_RULES.md` | Quy tắc giỏ hàng & thanh toán |
| `07_SECURITY_VALIDATION.md` | Bảo mật & validate |
| `08_TEST_CASES.md` | Kịch bản kiểm thử |
| `09_ACCEPTANCE_CRITERIA.md` | Tiêu chí nghiệm thu |
| `10_AI_CODING_PROMPTS.md` | Prompt hướng dẫn AI coding |
| `11_IMPLEMENTATION_ROADMAP.md` | Lộ trình triển khai |
| `12_DEPLOYMENT_NOTES.md` | Ghi chú deploy |
| `13_BACKLOG_OPTIONAL_FEATURES.md` | Tính năng tùy chọn backlog |

---

## 🔧 Troubleshooting nhanh

| Vấn đề | Giải pháp |
|---|---|
| `JWT_SECRET must be...` | Set JWT_SECRET ≥ 32 ký tự trong backend/.env |
| Prisma Client outdated | `npx prisma generate` |
| Migration conflict | `npx prisma migrate reset` (⚠️ XÓA DATA) |
| CORS error | Kiểm tra FRONTEND_URL, ADMIN_URL trong backend/.env |
| Upload không hiển thị | Kiểm tra static serve `/uploads` và volume mount |
| Admin không đăng nhập được | Kiểm tra đã seed admin chưa (SEED_ADMIN_EMAIL) |
| Docker build fail | `docker compose config` để validate env trước |

---

> **📌 File này dùng làm context xuyên suốt dự án. Cập nhật khi có thay đổi kiến trúc, thêm module, hoặc đổi convention.**
>
> *Cập nhật lần cuối: 2026-07-06*
