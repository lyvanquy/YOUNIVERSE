# 17. Deployment Guide

## Recommended Deployment

### Frontend / Next.js

Dùng Vercel.

### PostgreSQL

Dùng một trong các dịch vụ:

- Neon.
- Supabase.
- Railway.
- Render.
- Vercel Postgres.

## Environment Variables on Production

Cần set:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

Nếu dùng Prisma với connection pool của Neon/Supabase, cần dùng connection string đúng theo hướng dẫn provider.

## Build Command

```bash
npm run build
```

## Start Command

```bash
npm run start
```

Vercel tự xử lý Next.js.

## Prisma Migration on Production

Có 2 cách.

### Cách 1: Run migration local trỏ đến production database

```bash
DATABASE_URL="production-url" npx prisma migrate deploy
```

### Cách 2: Vercel build command

Không khuyến nghị nếu chưa kiểm soát kỹ, nhưng có thể dùng:

```bash
prisma generate && next build
```

Migration production nên chạy thủ công hoặc qua CI/CD.

## Static-first Deployment

Nếu project chưa dùng database:

- Có thể deploy Vercel ngay.
- Không cần DATABASE_URL.
- API database chưa dùng thì không gọi.

## Database-driven Deployment

Nếu dùng database:

1. Tạo database production.
2. Set DATABASE_URL.
3. Chạy migration.
4. Chạy seed nếu cần.
5. Deploy Next.js.

## Image Assets

- Ảnh trong `public/images` sẽ deploy cùng project.
- Nếu ảnh lớn, nên tối ưu thành WebP/AVIF.
- Không upload file quá nặng.

## Domain

Khi có domain riêng:

- Trỏ domain về Vercel.
- Update `NEXT_PUBLIC_SITE_URL`.
- Kiểm tra metadata SEO.

## SEO Checklist Before Deploy

- Mỗi page có title/description.
- Có favicon.
- Có Open Graph image nếu có.
- Có alt text cho images.
- URL đúng:
  - `/`
  - `/our-universe`
  - `/about`

## Performance Checklist

- Chạy Lighthouse.
- Kiểm tra mobile.
- Tối ưu ảnh.
- Không import thư viện không cần thiết.
- Không chạy animation quá nặng.
- Dùng `next/image`.

## Post-deploy Test

Sau deploy, kiểm tra:

1. Home page load đúng.
2. Menu điều hướng đúng.
3. Our UNIverse có 3 product cards.
4. About có đủ story/mission/vision/core values.
5. Footer có social links.
6. Mobile menu hoạt động.
7. Không lỗi console.
8. Không lỗi 404 image.
9. CTA click đúng.
10. External social links mở tab mới.

## Rollback

Nếu deploy lỗi:

- Vercel có thể rollback về deployment trước.
- Không chạy migration phá dữ liệu nếu chưa backup.
- Với database phase 1 chủ yếu là content, rủi ro thấp.

## Production Notes

- Không commit `.env`.
- Không expose DATABASE_URL.
- Không log thông tin nhạy cảm.
- Nếu có form lead, cân nhắc anti-spam.
