# Seed Data Reference

Dữ liệu này dùng để tạo `prisma/seed.ts`.

## ProductLine

```ts
const productLines = [
  {
    slug: "astra",
    name: "Charm Astra",
    badge: "Unique",
    shortIntro: "Astra - Own your unique name, ignite your inner flame.",
    tagline:
      "A bold statement of identity, customized with your name, celestial symbols, and your unique elemental energy.",
    imageUrl: "/images/products/charm-astra.webp",
    ctaLabel: "Coming soon",
    ctaHref: null,
    sortOrder: 1,
    isActive: true,
  },
  {
    slug: "sirius",
    name: "Charm Sirius",
    badge: "Passion",
    shortIntro: "Sirius - Pack the joy you seek, let your passion speak.",
    tagline:
      "Encapsulate the little things you love, from simple everyday passions and sweet pets to your daily rituals.",
    imageUrl: "/images/products/charm-sirius.webp",
    ctaLabel: "Coming soon",
    ctaHref: null,
    sortOrder: 2,
    isActive: true,
  },
  {
    slug: "polaris",
    name: "Charm Polaris",
    badge: "Inspiring",
    shortIntro: "Polaris - Trust the guiding quote, let your spirit float.",
    tagline:
      "Inspiring quotes that serve as a guiding compass for your soul.",
    imageUrl: "/images/products/charm-polaris.webp",
    ctaLabel: "Coming soon",
    ctaHref: null,
    sortOrder: 3,
    isActive: true,
  },
];
```

## SocialLink

```ts
const socialLinks = [
  {
    platform: "TIKTOK",
    label: "TikTok",
    url: "https://www.tiktok.com/@youniverse_ueh.isb?_r=1&_t=ZS-96wc5zPz4a4",
    sortOrder: 1,
    isActive: true,
  },
  {
    platform: "INSTAGRAM",
    label: "Instagram",
    url: "https://www.instagram.com/youniverse_since2026/",
    sortOrder: 2,
    isActive: true,
  },
  {
    platform: "FACEBOOK",
    label: "Facebook",
    url: "https://www.facebook.com/share/17BFjM2d7T/?mibextid=wwXIfr",
    sortOrder: 3,
    isActive: true,
  },
];
```

## ContactPerson

```ts
const contacts = [
  {
    name: "Ms. Nguyễn Linh Chi",
    phone: "0335173280",
    role: "Project Leader",
    sortOrder: 1,
  },
  {
    name: "Mr. Trần Hải Đăng",
    phone: "0795722279",
    role: "Lead of Digital Media & Website",
    sortOrder: 2,
  },
  {
    name: "Ms. Quách Khả Thi",
    phone: "0858062402",
    role: "Lead of Market Research & Insights",
    sortOrder: 3,
  },
  {
    name: "Ms. Nguyễn Lý An Nhiên",
    phone: "0334230606",
    role: "Lead of Operations",
    sortOrder: 4,
  },
  {
    name: "Ms. Nguyễn Đỗ Như Hà",
    phone: "0943484784",
    role: "Lead of Research & Development",
    sortOrder: 5,
  },
  {
    name: "Ms. Lê Nữ Đan Vy",
    phone: "0914575205",
    role: "Lead of Sales",
    sortOrder: 6,
  },
  {
    name: "Ms. Dương Ngọc Phương Nghi",
    phone: "0346229446",
    role: "Production Manager",
    sortOrder: 7,
  },
  {
    name: "Ms. Trần Ngọc Thư",
    phone: "0913450445",
    role: "Lead of Public Relations",
    sortOrder: 8,
  },
];
```

## SiteSetting

```ts
const settings = [
  {
    key: "site_name",
    value: "YOUniverse",
  },
  {
    key: "slogan",
    value: "A galaxy to hold, a story to be told",
  },
  {
    key: "address",
    value: "279 Nguyễn Tri Phương street, Vườn Lài Ward, HCMC",
  },
];
```
