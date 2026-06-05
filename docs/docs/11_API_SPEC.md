# 11. API Specification

## Overview

API dùng cho Next.js backend chạy trên Node.js runtime. Database dùng PostgreSQL thông qua Prisma.

Trong giai đoạn 1, API không bắt buộc nếu dùng static data. Tuy nhiên tài liệu này chuẩn bị sẵn để AI/developer mở rộng khi cần.

## Base URL

Local:

```txt
http://localhost:3000/api
```

Production:

```txt
https://your-domain.com/api
```

## Common Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

## 1. Products API

### GET `/api/products`

Lấy danh sách product lines.

#### Query Params

| Name | Type | Required | Description |
|---|---|---|---|
| active | boolean | no | Nếu true, chỉ lấy sản phẩm active |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "astra",
      "name": "Charm Astra",
      "badge": "Unique",
      "shortIntro": "Astra - Own your unique name, ignite your inner flame.",
      "tagline": "A bold statement of identity, customized with your name, celestial symbols, and your unique elemental energy.",
      "imageUrl": "/images/products/charm-astra.webp",
      "ctaLabel": "Coming soon",
      "ctaHref": null,
      "sortOrder": 1,
      "isActive": true
    }
  ]
}
```

#### Notes

- Không trả giá sản phẩm.
- Sắp xếp theo `sortOrder ASC`.
- Chỉ lấy `isActive = true` nếu dùng public API.

## 2. Contacts API

### GET `/api/contacts`

Lấy danh sách main contact ở footer.

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Ms. Nguyễn Linh Chi",
      "phone": "0335173280",
      "role": "Project Leader",
      "sortOrder": 1
    }
  ]
}
```

## 3. Social Links API

### GET `/api/socials`

Lấy social links.

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "platform": "TIKTOK",
      "label": "TikTok",
      "url": "https://www.tiktok.com/@youniverse_ueh.isb?_r=1&_t=ZS-96wc5zPz4a4",
      "sortOrder": 1
    }
  ]
}
```

## 4. Site Settings API

### GET `/api/site-settings`

Lấy các global settings.

#### Response

```json
{
  "success": true,
  "data": {
    "site_name": "YOUniverse",
    "slogan": "A galaxy to hold, a story to be told",
    "address": "279 Nguyễn Tri Phương street, Vườn Lài Ward, HCMC"
  }
}
```

## 5. Page Content API

### GET `/api/pages/:page`

Ví dụ:

```txt
GET /api/pages/about
GET /api/pages/home
GET /api/pages/our-universe
```

#### Response

```json
{
  "success": true,
  "data": {
    "page": "ABOUT",
    "sections": [
      {
        "sectionKey": "our_story",
        "title": "Từ những cá tính bị rập khuôn đến một vũ trụ tự do.",
        "subtitle": "Our Story",
        "body": "Khởi nguồn từ những mảnh ghép..."
      }
    ]
  }
}
```

## 6. Lead Submission API

Chỉ dùng nếu thêm form quan tâm/liên hệ.

### POST `/api/leads`

#### Request Body

```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "0900000000",
  "message": "Tôi muốn biết thêm về Charm Astra",
  "source": "about_cta"
}
```

#### Validation

- `name`: optional, max 120.
- `email`: optional, valid email.
- `phone`: optional, max 30.
- `message`: required nếu không có email/phone.
- `source`: optional.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid"
  }
}
```

## Error Codes

| Status | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 404 | Resource not found |
| 500 | Server error |

## Validation

Nên dùng `zod`.

Example:

```ts
import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().max(120).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  message: z.string().max(1000).optional(),
  source: z.string().max(100).optional(),
});
```

## Security Notes

- Không expose DATABASE_URL.
- API POST phải validate input.
- Nếu form public, nên cân nhắc rate limiting.
- Không log thông tin nhạy cảm quá mức.
- Social links phải mở bằng `rel="noopener noreferrer"`.

## When Not to Use API

Nếu chỉ demo giao diện landing page, AI nên dùng static data trước để tiết kiệm thời gian.

Sau khi UI được khách duyệt, mới chuyển data sang API/Prisma nếu cần.
