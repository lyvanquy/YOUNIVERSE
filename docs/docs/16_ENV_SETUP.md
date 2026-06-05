# 16. Environment Setup

## Requirements

Cần cài:

- Node.js LTS.
- npm hoặc pnpm.
- PostgreSQL.
- Git.
- VS Code hoặc editor tương tự.

## Create Next.js Project

Command đề xuất:

```bash
npx create-next-app@latest youniverse-website \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Đi vào thư mục:

```bash
cd youniverse-website
```

## Install Dependencies

```bash
npm install framer-motion @prisma/client zod clsx tailwind-merge lucide-react
npm install -D prisma
```

## Prisma Init

```bash
npx prisma init
```

Sau đó copy nội dung từ:

```txt
database/schema.prisma
```

vào:

```txt
prisma/schema.prisma
```

## Environment Variables

Tạo file `.env` từ `.env.example`.

```bash
cp .env.example .env
```

Nội dung mẫu:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/youniverse?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## PostgreSQL Local Setup

Tạo database:

```sql
CREATE DATABASE youniverse;
```

Hoặc dùng GUI như pgAdmin, TablePlus, DBeaver.

## Run Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Optional Seed

Nếu đã tạo `prisma/seed.ts`, chạy:

```bash
npx prisma db seed
```

Nếu chưa có seed, dùng static data trước.

## Run Dev Server

```bash
npm run dev
```

Mở:

```txt
http://localhost:3000
```

## Recommended package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:studio": "prisma studio",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate"
  }
}
```

## Folder Setup

Sau khi tạo project, tạo các thư mục:

```bash
mkdir -p src/components/layout
mkdir -p src/components/home
mkdir -p src/components/products
mkdir -p src/components/about
mkdir -p src/components/shared
mkdir -p src/data
mkdir -p src/lib
mkdir -p src/types
mkdir -p public/images/banners
mkdir -p public/images/products
mkdir -p public/images/placeholders
mkdir -p public/images/logo
mkdir -p public/fonts/youth
mkdir -p public/fonts/montserrat
```

## Tailwind Config

Cần thêm brand colors vào `tailwind.config.ts` hoặc dùng CSS variables.

Ví dụ CSS variables trong `globals.css`:

```css
:root {
  --brand-blue: #2563eb;
  --brand-yellow: #facc15;
  --brand-red: #ef4444;
  --brand-orange: #f97316;
  --brand-black: #111111;
  --brand-white: #ffffff;
}
```

## Font Setup

Nếu có font file:

- Đặt vào `public/fonts`.
- Load bằng `next/font/local`.

Nếu chưa có:

- Dùng Montserrat từ `next/font/google`.
- Heading YOUTH dùng fallback trước.

## Development Order

1. Setup project.
2. Setup Tailwind + global styles.
3. Setup data files.
4. Build Header/Footer.
5. Build pages.
6. Add animation.
7. Add responsive.
8. Add Prisma schema.
9. Add API optional.
10. Test build.

## Troubleshooting

### Prisma cannot connect

Kiểm tra:

- PostgreSQL đang chạy.
- DATABASE_URL đúng.
- Database đã tạo.
- Username/password đúng.

### Font lỗi tiếng Việt

- Không dùng YOUTH cho tiếng Việt có dấu.
- Chuyển heading tiếng Việt sang Montserrat.

### Hydration error

- Tránh dùng `window` trực tiếp trong Server Component.
- Client component cần `"use client"` ở đầu file.
- Framer Motion component thường cần Client Component.

### Build lỗi vì Prisma

- Chạy `npx prisma generate`.
- Kiểm tra `@prisma/client` đã cài.
