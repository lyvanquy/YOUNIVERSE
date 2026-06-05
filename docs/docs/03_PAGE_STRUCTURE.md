# 03. Page Structure

## Route Map

| Page | Route | Purpose |
|---|---|---|
| Home | `/` | Giới thiệu thương hiệu, banner, slogan, product line, hướng dẫn build YOUniverse |
| Our UNIverse | `/our-universe` | Danh sách 3 dòng charm |
| About us | `/about` | Câu chuyện, sứ mệnh, tầm nhìn, giá trị cốt lõi |

## Global Layout

```txt
RootLayout
├── Header
├── Page Content
└── Footer
```

## Home Page Structure

```txt
HomePage
├── Header
├── HeroBanner
│   ├── Placeholder banner image
│   ├── Decorative sparkle elements
│   └── Optional hero text
├── MarqueeCTA
│   └── "A galaxy to hold, a story to be told"
├── ProductLineIntroduction
│   ├── SectionTitle: "Khám Phá Các Hành Tinh"
│   └── ProductCarousel
│       ├── Astra card
│       ├── Sirius card
│       └── Polaris card
├── HowToBuildSection
│   ├── SectionTitle: "How to Build Your YOUniverse"
│   ├── Step 1: Set Your Vibe
│   ├── Step 2: Mix & match Astra, Sirius, Polaris
│   └── Step 3: Tell your story
└── Footer
```

## Our UNIverse Page Structure

```txt
OurUniversePage
├── Header
├── PageBanner
│   ├── Placeholder banner
│   └── Decorative elements
├── ProductListingSection
│   ├── SectionTitle: "OUR PRODUCTS"
│   └── ProductGrid
│       ├── ProductCard: Charm Astra
│       ├── ProductCard: Charm Sirius
│       └── ProductCard: Charm Polaris
├── MarqueeCTA
│   └── "A galaxy to hold, a story to be told"
└── Footer
```

## About Page Structure

```txt
AboutPage
├── Header
├── AboutHero / Intro
├── StorySection
│   ├── Label: Our Story
│   └── Headline + paragraphs
├── MissionVisionSection
│   ├── Mission card
│   └── Vision card
├── CoreValuesSection
│   ├── ValueCard: Y - You-nique
│   ├── ValueCard: O - Out-of-the-box
│   └── ValueCard: U - Unconditional connection
├── CTASection
│   └── Button link to /our-universe
└── Footer
```

## Suggested Section Heights

### Desktop

- Header: 72px - 96px.
- Hero banner: 520px - 720px.
- Marquee: 80px - 120px.
- Product line: 600px - 800px.
- How to Build: 500px - 700px.
- Footer: auto.

### Mobile

- Header: 64px.
- Hero banner: 420px - 560px.
- Marquee: 64px - 90px.
- Product line: auto.
- How to Build: auto.
- Footer: auto.

## Navigation Behavior

| Action | Result |
|---|---|
| Click logo | Navigate to `/` |
| Click Home | Navigate to `/` |
| Click Our UNIverse | Navigate to `/our-universe` |
| Click About us | Navigate to `/about` |
| Click marquee on Home | Navigate to `/about` or `/our-universe` |
| Click CTA on About | Navigate to `/our-universe` |

## UX Flow

1. User vào Home.
2. User xem brand impression qua hero/banner.
3. User thấy slogan chạy.
4. User xem 3 dòng charm.
5. User hiểu cách build YOUniverse.
6. User bấm sang Our UNIverse để xem sản phẩm.
7. User bấm About để hiểu câu chuyện thương hiệu.

## Page Metadata

### Home

- Title: `YOUniverse | A galaxy to hold, a story to be told`
- Description: `Discover YOUniverse, a Gen Z personalized charm brand where every charm tells your story.`

### Our UNIverse

- Title: `Our UNIverse | YOUniverse Products`
- Description: `Explore Astra, Sirius and Polaris charm lines by YOUniverse.`

### About us

- Title: `About us | YOUniverse`
- Description: `Learn the story, mission, vision and core values behind YOUniverse.`
