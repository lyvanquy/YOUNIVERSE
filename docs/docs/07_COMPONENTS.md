# 07. Components Specification

## Component Naming Convention

- Component dùng PascalCase.
- File component dùng PascalCase.
- Component chia theo domain:
  - `layout`
  - `home`
  - `products`
  - `about`
  - `shared`

## Layout Components

### `Header`

Path:

```txt
src/components/layout/Header.tsx
```

Props đề xuất:

```ts
type HeaderProps = {
  logoText?: string;
};
```

Responsibilities:

- Render navigation.
- Render logo.
- Handle active route.
- Handle mobile menu.
- Logo link về `/`.

Subcomponents có thể tách:

- `DesktopNav`
- `MobileNav`
- `Logo`

### `Footer`

Path:

```txt
src/components/layout/Footer.tsx
```

Responsibilities:

- Render logo/slogan.
- Render address.
- Render social links.
- Render main contacts.
- Responsive layout.

Props:

```ts
type FooterProps = {
  contacts: ContactPerson[];
  socials: SocialLink[];
};
```

## Shared Components

### `SectionTitle`

Path:

```txt
src/components/shared/SectionTitle.tsx
```

Props:

```ts
type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};
```

Usage:

- Product section.
- About section.
- How to Build section.

### `DecorativeElements`

Path:

```txt
src/components/shared/DecorativeElements.tsx
```

Responsibilities:

- Render star/sparkle/shape elements.
- Có thể nhận variant.

Props:

```ts
type DecorativeElementsProps = {
  variant?: "hero" | "section" | "card";
};
```

### `GlowButton`

Path:

```txt
src/components/shared/GlowButton.tsx
```

Props:

```ts
type GlowButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};
```

Responsibilities:

- Render button/link.
- Hover glow.
- Focus state.

### `MarqueeCTA`

Path:

```txt
src/components/shared/MarqueeCTA.tsx
```

Props:

```ts
type MarqueeCTAProps = {
  text: string;
  href?: string;
  direction?: "left" | "right";
};
```

Responsibilities:

- Render running slogan.
- Handle hover effect.
- Link to target page.

## Home Components

### `HeroBanner`

Path:

```txt
src/components/home/HeroBanner.tsx
```

Props:

```ts
type HeroBannerProps = {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
};
```

Responsibilities:

- Render banner placeholder or real image.
- Render hero copy.
- Render decorative elements.

### `ProductLineIntroduction`

Path:

```txt
src/components/home/ProductLineIntroduction.tsx
```

Responsibilities:

- Render section title.
- Render product carousel/cards.

Props:

```ts
type ProductLineIntroductionProps = {
  products: ProductLine[];
};
```

### `ProductCarousel`

Path:

```txt
src/components/home/ProductCarousel.tsx
```

Responsibilities:

- Render Astra, Sirius, Polaris cards.
- Desktop grid or carousel.
- Mobile horizontal snap.

Props:

```ts
type ProductCarouselProps = {
  items: ProductLine[];
};
```

### `HowToBuildSection`

Path:

```txt
src/components/home/HowToBuildSection.tsx
```

Responsibilities:

- Render 3 step cards.
- Render orbit/timeline connector.
- Animate cards.

Props:

```ts
type HowToBuildSectionProps = {
  steps: BuildStep[];
};
```

### `BuildStepCard`

Path:

```txt
src/components/home/BuildStepCard.tsx
```

Props:

```ts
type BuildStepCardProps = {
  index: number;
  title: string;
  description: string;
};
```

## Product Components

### `ProductGrid`

Path:

```txt
src/components/products/ProductGrid.tsx
```

Props:

```ts
type ProductGridProps = {
  products: ProductLine[];
};
```

Responsibilities:

- Render responsive product cards.
- Animate cards from left to right.

### `ProductCard`

Path:

```txt
src/components/products/ProductCard.tsx
```

Props:

```ts
type ProductCardProps = {
  product: ProductLine;
};
```

Responsibilities:

- Render image.
- Render badge.
- Render heading.
- Render tagline.
- Render CTA.
- Do not render price.

### `PageBanner`

Path:

```txt
src/components/products/PageBanner.tsx
```

Responsibilities:

- Render Our UNIverse banner.
- Placeholder if no image.

## About Components

### `StorySection`

Path:

```txt
src/components/about/StorySection.tsx
```

Responsibilities:

- Render Our Story headline and paragraphs.
- Add decorative visual.

### `MissionVisionSection`

Path:

```txt
src/components/about/MissionVisionSection.tsx
```

Responsibilities:

- Render Mission card.
- Render Vision card.

### `CoreValuesSection`

Path:

```txt
src/components/about/CoreValuesSection.tsx
```

Responsibilities:

- Render Y/O/U cards in 3 columns.
- Animate on scroll.

### `ValueCard`

Path:

```txt
src/components/about/ValueCard.tsx
```

Props:

```ts
type ValueCardProps = {
  letter: string;
  title: string;
  description: string;
};
```

### `CTASection`

Path:

```txt
src/components/about/CTASection.tsx
```

Responsibilities:

- Render large CTA text/button.
- Link to `/our-universe`.

## Data Types

Create file:

```txt
src/types/index.ts
```

Types:

```ts
export type ProductLine = {
  id: string;
  slug: string;
  name: string;
  badge: string;
  shortIntro: string;
  tagline: string;
  imageUrl?: string | null;
  ctaLabel: string;
  ctaHref?: string | null;
};

export type BuildStep = {
  id: string;
  order: number;
  title: string;
  description: string;
};

export type SocialLink = {
  id: string;
  platform: "tiktok" | "instagram" | "facebook" | string;
  label: string;
  url: string;
};

export type ContactPerson = {
  id: string;
  name: string;
  phone: string;
  role: string;
};
```

## Data Files

Nếu chưa dùng database, tạo static data trước:

```txt
src/data/navigation.ts
src/data/products.ts
src/data/buildSteps.ts
src/data/about.ts
src/data/footer.ts
```

Khi database sẵn sàng, có thể chuyển các file data thành fallback nếu API lỗi.

## Animation Components

Nên tạo helper variants:

```txt
src/lib/motion.ts
```

Ví dụ:

```ts
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};
```
