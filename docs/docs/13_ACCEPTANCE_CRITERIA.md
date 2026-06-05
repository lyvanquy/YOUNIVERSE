# 13. Acceptance Criteria

## General Acceptance Criteria

Website được xem là đạt nếu:

- Có đủ 3 trang:
  - Home.
  - Our UNIverse.
  - About us.
- Menu điều hướng đúng.
- Logo click về Home.
- Header đúng yêu cầu cơ bản.
- Footer đúng nội dung.
- Responsive tốt trên desktop, tablet, mobile.
- Không có lỗi console nghiêm trọng.
- Không vỡ layout khi thiếu ảnh thật.
- Màu sắc và style bám theo brief.
- Animation mượt, không gây rối.

## Header

Đạt khi:

- Logo nằm giữa header trên desktop.
- Menu nằm bên trái header trên desktop.
- Menu có 3 item:
  - Home
  - Our UNIverse
  - About us
- Hover menu có hiệu ứng nổi lên.
- Hover menu đổi màu xanh/vàng/đỏ.
- Logo click về `/`.
- Mobile có menu hamburger hoặc layout phù hợp.
- Active route được highlight.

## Footer

Đạt khi:

- Footer nền đen.
- Có logo YOUniverse.
- Có slogan:
  `A galaxy to hold, a story to be told`
- Có address:
  `279 Nguyễn Tri Phương street, Vườn Lài Ward, HCMC`
- Có social links:
  - TikTok
  - Instagram
  - Facebook
- Có đủ 8 main contacts.
- Desktop hiển thị contact dạng grid.
- Mobile không bị tràn ngang.

## Home Page

Đạt khi có đủ:

1. Header.
2. Hero banner/placeholder.
3. Marquee slogan.
4. Product line introduction.
5. How to Build Your YOUniverse.
6. Footer.

### Hero Banner

- Có vùng banner rõ ràng.
- Dùng placeholder nếu chưa có ảnh.
- Có style vũ trụ/sparkle.

### Marquee

- Text chạy:
  `A galaxy to hold, a story to be told`
- Hover có hiệu ứng.
- Click điều hướng đúng.

### Product Line Introduction

- Có headline:
  `Khám Phá Các Hành Tinh`
- Có 3 dòng:
  - Astra
  - Sirius
  - Polaris
- Hover card hiện tagline hoặc làm nổi tagline.
- Có animation nhẹ.

### How to Build

- Có headline:
  `How to Build Your YOUniverse`
- Có 3 bước:
  - Set Your Vibe.
  - Mix & match Astra, Sirius, Polaris.
  - Tell your story.
- Layout không nhàm chán.
- Có responsive mobile.

## Our UNIverse Page

Đạt khi có đủ:

1. Header.
2. Banner.
3. Headline `OUR PRODUCTS`.
4. 3 product cards.
5. Running slogan.
6. Footer.

### Product Cards

Mỗi card phải có:

- Image hoặc placeholder.
- Badge.
- Heading.
- Tagline.
- CTA `Coming soon`.

Không được có:

- Giá sản phẩm.
- Nút Add to cart.
- Nút Buy now.

### Product Data

#### Astra

- Badge: `Unique`
- Heading: `Charm Astra`
- Tagline đúng brief.

#### Sirius

- Badge: `Passion`
- Heading: `Charm Sirius`
- Tagline đúng brief.

#### Polaris

- Badge: `Inspiring`
- Heading: `Charm Polaris`
- Tagline đúng brief.

### Animation

- Cards hiện từ trái sang phải.
- Hover card nâng lên/scale nhẹ.

## About Page

Đạt khi có đủ:

1. Header.
2. Our Story.
3. Our Mission.
4. Our Vision.
5. Our Core Values.
6. CTA button.
7. Footer.

### Our Story

- Có headline:
  `Từ những cá tính bị rập khuôn đến một vũ trụ tự do.`
- Có đủ nội dung câu chuyện.

### Mission

- Có đúng nội dung về "quyền được là chính mình".

### Vision

- Có đúng nội dung về thương hiệu phụ kiện cá nhân hóa hàng đầu của Gen Z do UEH.ISB-ers sáng lập.

### Core Values

- Hiển thị 3 giá trị:
  - Y - You-nique
  - O - Out-of-the-box
  - U - Unconditional connection
- Desktop: 3 cột.
- Mobile: 1 cột.

### CTA

- Text:
  `Vậy bạn đã sẵn sàng để tạo ra vũ trụ cho riêng mình chưa?`
- Hover sáng lên.
- Click sang `/our-universe`.

## Backend / Database

Nếu triển khai database trong phase này, đạt khi:

- Prisma schema chạy migrate được.
- PostgreSQL connect được.
- Có seed data cho:
  - ProductLine.
  - SocialLink.
  - ContactPerson.
  - SiteSetting.
- API `/api/products` trả đúng 3 products.
- API `/api/contacts` trả contacts.
- API `/api/socials` trả social links.
- Không expose thông tin database ra client.

Nếu chưa triển khai database trong phase này:

- Phải có static data tương ứng trong `src/data`.
- UI vẫn chạy đầy đủ.

## Responsive Testing

### Desktop

- Width 1440px.
- Header menu đúng vị trí.
- Product cards 3 cột.
- Core values 3 cột.
- Footer nhiều cột.

### Tablet

- Width 768px.
- Layout không tràn ngang.
- Product cards 2 cột hoặc scroll ngang.
- Footer 2 cột hoặc hợp lý.

### Mobile

- Width 375px.
- Menu mobile hoạt động.
- Product cards 1 cột.
- Text không quá lớn.
- Footer 1 cột.
- Không xuất hiện horizontal scroll.

## Quality Checklist

- `npm run build` thành công.
- `npm run lint` không lỗi nghiêm trọng.
- Không có unused imports nhiều.
- Không có hard-coded duplicate content quá nhiều.
- Component dễ đọc.
- Data dễ thay đổi.
- Assets placeholder có thể thay thế nhanh.
