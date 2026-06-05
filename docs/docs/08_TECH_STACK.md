# 08. Tech Stack

## Final Tech Stack

### Runtime

- Node.js

### Database

- PostgreSQL

### ORM

- Prisma

### Frontend Framework

- Next.js

### UI Library

- React

### Language

- TypeScript

### Styling

- Tailwind CSS

### Animation

- Framer Motion

## Recommended Version Strategy

Use stable modern versions:

- Node.js LTS.
- Next.js latest stable.
- React stable version bundled with Next.js.
- TypeScript latest stable compatible with Next.js.
- Tailwind CSS stable.
- Prisma stable.
- PostgreSQL 15+ or 16+.

## Why This Stack Fits

### Next.js

Phù hợp vì:

- Làm landing page tốt.
- Có routing sẵn.
- Hỗ trợ SEO tốt.
- Dễ deploy.
- Có thể xử lý API bằng Route Handlers.
- Có thể mở rộng backend nhẹ trong cùng project.

### React

Phù hợp vì:

- Dễ chia component.
- Dễ tái sử dụng UI.
- Framer Motion tích hợp tốt.

### TypeScript

Phù hợp vì:

- Giảm lỗi khi project lớn dần.
- Định nghĩa type rõ cho Product, Contact, SocialLink.
- Dễ để AI code đúng hơn.

### Tailwind CSS

Phù hợp vì:

- Style nhanh.
- Dễ responsive.
- Dễ giữ design system qua class/token.
- Dễ tạo hover và animation utilities.

### Framer Motion

Phù hợp vì brief yêu cầu nhiều hiệu ứng:

- Hover.
- Stagger animation.
- Scroll reveal.
- Card lift.
- CTA glow.
- Mobile menu animation.

### Prisma + PostgreSQL

Phù hợp để:

- Lưu dữ liệu sản phẩm.
- Lưu contact.
- Lưu social links.
- Lưu content page nếu cần chỉnh sửa.
- Chuẩn bị nền tảng cho e-commerce sau này.

## Architecture Options

### Option A: Static-first with Database Ready

Phù hợp nhất cho giai đoạn 1.

- Frontend dùng static data trong `src/data`.
- Prisma schema chuẩn bị sẵn.
- API có thể làm sau hoặc làm song song.
- Website chạy nhanh, ít phụ thuộc database.

Ưu điểm:

- Code nhanh.
- Ít lỗi.
- Dễ demo cho khách.
- Không bị chặn bởi database.

Nhược điểm:

- Khách muốn tự sửa content thì chưa có admin.

### Option B: Database-driven

- Tất cả products, contacts, social links fetch từ PostgreSQL.
- Prisma seed dữ liệu ban đầu.
- API route trả dữ liệu cho frontend.

Ưu điểm:

- Data có cấu trúc.
- Dễ mở rộng admin.

Nhược điểm:

- Setup phức tạp hơn.
- Cần database khi chạy local/deploy.

### Đề xuất

Dùng Option A + chuẩn bị Option B.

Cụ thể:

- Code UI đọc từ `src/data/*.ts` ban đầu.
- Có sẵn `database/schema.prisma`.
- Có sẵn `prisma/seed.ts` sau khi bắt đầu code thật.
- Khi cần, chuyển data source sang Prisma.

## Suggested Packages

```txt
next
react
react-dom
typescript
tailwindcss
postcss
autoprefixer
framer-motion
@prisma/client
prisma
zod
clsx
tailwind-merge
lucide-react
```

## Optional Packages

```txt
next-safe-action
react-hook-form
@hookform/resolvers
sonner
```

Chỉ thêm nếu có form hoặc server actions.

## Project Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

Prisma:

```bash
npx prisma init
npx prisma migrate dev
npx prisma generate
npx prisma db seed
npx prisma studio
```

## Environment Variables

Cần có:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/youniverse?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## Deployment Recommendation

### Frontend + Backend

- Vercel cho Next.js.
- Database PostgreSQL dùng:
  - Neon
  - Supabase
  - Railway
  - Render
  - Vercel Postgres

### Nếu deploy đơn giản

- Frontend trên Vercel.
- Database Neon.
- Prisma migrations chạy khi deploy hoặc thủ công.

## Notes for AI Coding

AI phải hiểu:

- Đây là Next.js App Router project.
- Dùng TypeScript.
- Dùng Tailwind cho styling.
- Dùng Framer Motion cho animation.
- Dùng Prisma cho data layer.
- Không dùng CSS framework khác nếu không được yêu cầu.
- Không dùng JavaScript thuần nếu đã chốt TypeScript.
