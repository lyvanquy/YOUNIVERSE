# 15. Responsive Specification

## Breakpoints

Dùng Tailwind default breakpoints:

```txt
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## General Rules

- Mobile-first.
- Không để horizontal scroll.
- Text heading phải giảm size trên mobile.
- Card grid chuyển về 1 cột trên mobile.
- Footer chuyển về 1 cột trên mobile.
- Menu desktop chuyển thành hamburger trên mobile.

## Header Responsive

### Desktop >= 1024px

- Header dùng grid 3 vùng.
- Menu bên trái.
- Logo giữa.
- Vùng phải có thể trống hoặc decorative.
- Header cao khoảng 72px - 96px.

### Tablet 768px - 1023px

- Có thể vẫn hiển thị menu nếu đủ chỗ.
- Nếu menu bị chật, chuyển hamburger.

### Mobile < 768px

- Logo nằm trái hoặc giữa.
- Hamburger bên phải.
- Menu mở dropdown/drawer.
- Menu item full width, dễ bấm.
- Không dùng hover làm trạng thái chính vì mobile không hover.

## Home Responsive

### Hero Banner

Desktop:

- Height: 560px - 720px.
- Text lớn.

Tablet:

- Height: 480px - 600px.
- Text giảm size.

Mobile:

- Height: 420px - 560px.
- Text chia dòng hợp lý.
- Decorative elements giảm bớt.

### Marquee

Desktop:

- Font size lớn: 40px - 72px.
- Height: 90px - 120px.

Mobile:

- Font size: 24px - 36px.
- Height: 64px - 90px.

### Product Carousel

Desktop:

- 3 cards trên một hàng.

Tablet:

- 2 cards hoặc horizontal scroll.

Mobile:

- Horizontal scroll snap hoặc 1 card mỗi hàng.
- Nên dùng scroll snap để vẫn có cảm giác carousel.

### How to Build

Desktop:

- 3 step cards ngang.
- Có connector/orbit line.

Tablet:

- 3 cards có thể vẫn ngang nếu đủ.
- Hoặc 2 + 1.

Mobile:

- 1 cột.
- Connector chuyển thành vertical line hoặc ẩn.

## Our UNIverse Responsive

### Product Grid

Desktop >= 1024px:

```txt
3 columns
```

Tablet >= 768px:

```txt
2 columns
```

Mobile < 768px:

```txt
1 column
```

### Product Card

Mobile:

- Image area không quá cao.
- Button full width hoặc vừa đủ.
- Tagline không bị cắt mất nội dung quan trọng.

## About Responsive

### Story Section

Desktop:

- 2 columns:
  - Text.
  - Visual/decorative area.

Mobile:

- 1 column.
- Visual có thể nằm trên hoặc dưới text.
- Text căn trái để dễ đọc.

### Mission + Vision

Desktop:

- 2 columns.

Mobile:

- 1 column.

### Core Values

Desktop:

- 3 columns.

Tablet:

- 3 columns nếu đủ hoặc 2 + 1.

Mobile:

- 1 column.

### CTA

Mobile:

- Button có thể full width.
- Text không quá dài trong một dòng.

## Footer Responsive

Desktop:

- 3 main columns:
  - Logo/slogan.
  - Address/socials.
  - Contacts grid.
- Contacts: 4 columns x 2 rows.

Tablet:

- 2 columns.
- Contacts: 2 columns.

Mobile:

- 1 column.
- Contacts: 1 column.
- Social links dễ bấm.
- Font size vừa phải.

## Typography Responsive

Suggested sizes:

### Hero title

```txt
mobile: text-4xl
tablet: text-5xl
desktop: text-7xl or text-8xl
```

### Section title

```txt
mobile: text-3xl
tablet: text-4xl
desktop: text-5xl or text-6xl
```

### Body

```txt
mobile: text-base
desktop: text-lg
```

### Footer

```txt
mobile: text-sm
desktop: text-sm / text-base
```

## Spacing Responsive

Suggested section padding:

```txt
mobile: py-16 px-5
tablet: py-20 px-8
desktop: py-24 px-10
```

Container width:

```txt
max-w-7xl mx-auto
```

## Testing Devices

Test tối thiểu:

- Mobile: 375x812.
- Mobile large: 430x932.
- Tablet: 768x1024.
- Laptop: 1366x768.
- Desktop: 1440x900.
- Large desktop: 1920x1080.

## Common Problems to Avoid

- Header menu tràn ngang.
- Marquee text quá lớn trên mobile.
- Product card image bị méo.
- Footer contact grid quá nhỏ.
- CTA text quá dài làm vỡ nút.
- About page paragraph quá rộng trên desktop.
- Decorative elements che mất text.
