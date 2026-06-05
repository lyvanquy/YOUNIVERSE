# 10. Database and Prisma Specification

## Purpose

Database trong giai đoạn 1 không bắt buộc cho giao diện tĩnh, nhưng đã được chuẩn bị theo yêu cầu công nghệ:

- PostgreSQL.
- Prisma ORM.
- Node.js runtime.

Database phục vụ:

1. Quản lý product lines.
2. Quản lý social links.
3. Quản lý main contacts.
4. Quản lý page content sections.
5. Lưu lead/contact submissions nếu sau này thêm form.
6. Chuẩn bị nền tảng cho e-commerce trong giai đoạn sau.

## Database Name

Suggested:

```txt
youniverse
```

## Main Entities

### ProductLine

Lưu 3 dòng charm:

- Astra
- Sirius
- Polaris

Fields:

- id
- slug
- name
- badge
- shortIntro
- tagline
- description
- imageUrl
- ctaLabel
- ctaHref
- sortOrder
- isActive
- createdAt
- updatedAt

### SocialLink

Lưu TikTok, Instagram, Facebook.

Fields:

- id
- platform
- label
- url
- sortOrder
- isActive
- createdAt
- updatedAt

### ContactPerson

Lưu main contact ở footer.

Fields:

- id
- name
- phone
- role
- sortOrder
- isActive
- createdAt
- updatedAt

### SiteSetting

Lưu slogan, address, logo text, global setting.

Fields:

- id
- key
- value
- createdAt
- updatedAt

### PageContent

Lưu content theo section nếu muốn database-driven.

Fields:

- id
- page
- sectionKey
- title
- subtitle
- body
- sortOrder
- isActive
- createdAt
- updatedAt

### LeadSubmission

Lưu thông tin người dùng nếu sau này có form liên hệ / quan tâm sản phẩm.

Fields:

- id
- name
- email
- phone
- message
- source
- createdAt

## Prisma Schema

Dùng file:

```txt
database/schema.prisma
```

Khi tạo project thật, copy nội dung vào:

```txt
prisma/schema.prisma
```

## Enum

### PageType

```prisma
enum PageType {
  HOME
  OUR_UNIVERSE
  ABOUT
}
```

### SocialPlatform

```prisma
enum SocialPlatform {
  TIKTOK
  INSTAGRAM
  FACEBOOK
  OTHER
}
```

## Seed Data Required

Seed ban đầu cần có:

### ProductLine

1. Charm Astra
2. Charm Sirius
3. Charm Polaris

### SocialLink

1. TikTok
2. Instagram
3. Facebook

### ContactPerson

8 contacts trong footer.

### SiteSetting

- site_name = YOUniverse
- slogan = A galaxy to hold, a story to be told
- address = 279 Nguyễn Tri Phương street, Vườn Lài Ward, HCMC

### PageContent

- Home hero placeholder.
- About story.
- About mission.
- About vision.
- Core values.

## Data Fetching Strategy

### Phase 1 Recommended

Ban đầu dùng static data trong `src/data`.

Lý do:

- Dễ code.
- Không cần database để demo UI.
- Không bị chậm tiến độ do setup backend.

### Phase 1 Plus

Sau khi UI ổn:

- Tạo PostgreSQL database.
- Tạo Prisma schema.
- Seed data.
- Tạo API route.
- Thay static data bằng fetch API hoặc server-side Prisma query.

## API with Prisma

Trong Next.js App Router, có thể query Prisma trực tiếp ở Server Components:

```ts
import { db } from "@/lib/db";

export default async function OurUniversePage() {
  const products = await db.productLine.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return <ProductGrid products={products} />;
}
```

Hoặc tạo API:

```txt
GET /api/products
```

## Migration Commands

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
npx prisma studio
```

## Important Notes

- Không lưu giá sản phẩm vì brief yêu cầu bỏ giá.
- Không tạo bảng Order/Cart/Payment nếu khách chưa xác nhận bán hàng thật.
- Nên thiết kế schema dễ mở rộng.
- Image URL có thể là path trong public hoặc URL CDN.
- Phone nên lưu string để giữ số 0 đầu.
