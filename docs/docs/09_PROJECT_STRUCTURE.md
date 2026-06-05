# 09. Project Structure

## Recommended Structure

```txt
youniverse-website/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── images/
│   │   ├── placeholders/
│   │   ├── products/
│   │   ├── banners/
│   │   └── logo/
│   └── fonts/
│       ├── youth/
│       └── montserrat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── products/
│   │   │   │   └── route.ts
│   │   │   ├── contacts/
│   │   │   │   └── route.ts
│   │   │   ├── socials/
│   │   │   │   └── route.ts
│   │   │   └── leads/
│   │   │       └── route.ts
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── our-universe/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── about/
│   │   │   ├── CTASection.tsx
│   │   │   ├── CoreValuesSection.tsx
│   │   │   ├── MissionVisionSection.tsx
│   │   │   ├── StorySection.tsx
│   │   │   └── ValueCard.tsx
│   │   ├── home/
│   │   │   ├── BuildStepCard.tsx
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── HowToBuildSection.tsx
│   │   │   ├── ProductCarousel.tsx
│   │   │   └── ProductLineIntroduction.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── NavLink.tsx
│   │   ├── products/
│   │   │   ├── PageBanner.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductGrid.tsx
│   │   └── shared/
│   │       ├── DecorativeElements.tsx
│   │       ├── GlowButton.tsx
│   │       ├── MarqueeCTA.tsx
│   │       └── SectionTitle.tsx
│   ├── data/
│   │   ├── about.ts
│   │   ├── buildSteps.ts
│   │   ├── footer.ts
│   │   ├── navigation.ts
│   │   └── products.ts
│   ├── lib/
│   │   ├── db.ts
│   │   ├── motion.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   └── types/
│       └── index.ts
├── docs/
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## App Router

Dùng Next.js App Router.

Pages:

```txt
src/app/page.tsx
src/app/our-universe/page.tsx
src/app/about/page.tsx
```

Layout:

```txt
src/app/layout.tsx
```

Global styles:

```txt
src/app/globals.css
```

## API Routes

Nếu dùng database ngay, tạo API routes:

```txt
GET /api/products
GET /api/contacts
GET /api/socials
POST /api/leads
```

Nếu chưa dùng database, API có thể để sau.

## Data Layer

### Static data

Dùng trong giai đoạn đầu:

```txt
src/data/products.ts
src/data/footer.ts
src/data/about.ts
src/data/buildSteps.ts
```

### Prisma data

Khi cần database:

```txt
src/lib/db.ts
```

Nội dung:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

## Asset Folders

### Images

```txt
public/images/banners/
public/images/products/
public/images/placeholders/
public/images/logo/
```

Suggested names:

```txt
home-banner.webp
our-universe-banner.webp
charm-astra.webp
charm-sirius.webp
charm-polaris.webp
logo-light.svg
logo-dark.svg
```

### Fonts

```txt
public/fonts/youth/
public/fonts/montserrat/
```

Không bắt buộc commit font vào repo nếu chưa có quyền rõ ràng.

## Naming Routes

| Page | Route | File |
|---|---|---|
| Home | `/` | `src/app/page.tsx` |
| Our UNIverse | `/our-universe` | `src/app/our-universe/page.tsx` |
| About us | `/about` | `src/app/about/page.tsx` |

## Naming Components

Good:

```txt
Header.tsx
Footer.tsx
ProductCard.tsx
CoreValuesSection.tsx
```

Avoid:

```txt
header.tsx
footer-component.tsx
comp1.tsx
test.tsx
```

## Styling Rules

- Dùng Tailwind class trong component.
- Dùng CSS variables cho brand colors trong `globals.css`.
- Không dùng inline style trừ trường hợp cần dynamic animation.
- Không dùng nhiều file CSS riêng nếu không cần.

## Import Alias

Cấu hình alias:

```txt
@/components
@/data
@/lib
@/types
```

Ví dụ:

```ts
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
```
