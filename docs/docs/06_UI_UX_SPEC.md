# 06. UI / UX Specification

## 1. Overall Layout Style

Website nên có layout:

- Rộng rãi.
- Nhiều khoảng trắng.
- Typography lớn.
- Section rõ ràng.
- Card bo góc vừa phải.
- Có element trang trí nhỏ.
- Motion nhẹ khi scroll.

Giao diện không nên quá giống template e-commerce phổ thông. Cần có cảm giác brand cá tính, trẻ và có concept "vũ trụ".

## 2. Header UI

### Desktop

Bố cục đề xuất:

```txt
┌────────────────────────────────────────────┐
│ Home   Our UNIverse   About us   YOUniverse│
└────────────────────────────────────────────┘
```

Theo brief logo nằm giữa. Để vừa đáp ứng brief vừa dễ responsive, có thể dùng CSS grid 3 cột:

```txt
left: navigation
center: logo
right: empty / decorative / CTA nhỏ
```

### Header behavior

- Sticky hoặc static đều được, nhưng sticky sẽ tiện hơn.
- Nếu sticky:
  - Background trắng mờ nhẹ.
  - Backdrop blur.
  - Border bottom nhẹ.
- Logo click về `/`.

### Header hover animation

Menu item hover:

- TranslateY(-2px).
- Chuyển màu theo từng item.
- Có underline nhỏ hoặc sparkle nhỏ xuất hiện.

Example mapping:

```ts
Home -> blue
Our UNIverse -> yellow
About us -> red
```

### Mobile Header

- Logo nằm giữa hoặc trái.
- Hamburger icon bên phải.
- Menu mở dạng dropdown full-width.
- Item có spacing lớn để dễ bấm.
- Có animation height/fade.

## 3. Hero Banner UI

Vì chưa có banner thật, dùng placeholder:

- Large rounded rectangle hoặc full-width section.
- Nền trắng / off-white.
- Dùng decorative elements như stars, orbit, blobs màu xanh/vàng/đỏ.
- Có dòng chữ hero tạm:
  - `Create your own little universe.`
  - `Personalized charms that carry your name, your passion and your story.`

Khi có banner thật:

- Dùng `next/image`.
- Ưu tiên ảnh WebP/AVIF.
- Có alt text rõ ràng.

## 4. Marquee CTA UI

Text:

```txt
A galaxy to hold, a story to be told
```

Yêu cầu:

- Chạy ngang liên tục.
- Có thể lặp 3-5 lần trong track để không bị trống.
- Font lớn.
- Hover:
  - Pause hoặc slow down.
  - Chữ sáng hơn.
  - Scale nhẹ.
- Click:
  - Home: sang `/about` hoặc `/our-universe`.
  - Our UNIverse: có thể scroll lên products hoặc giữ link `/about`.

Framer Motion có thể dùng cho motion, nhưng marquee vô hạn có thể dùng CSS animation để nhẹ hơn.

## 5. Product Carousel UI - Home

### Layout đề xuất

Desktop:

```txt
[Section title]
[Large carousel area]
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Astra        │ │ Sirius       │ │ Polaris      │
└──────────────┘ └──────────────┘ └──────────────┘
```

Nếu muốn đúng "carousel", có thể:

- Hiển thị 3 cards trên desktop.
- Trên mobile cho scroll ngang snap.
- Dùng arrows/dots nếu cần.

### Product hover

- Card scale 1.02.
- Image scale 1.05.
- Overlay text fade in.
- Border hoặc shadow xuất hiện.
- Sparkle element rotate nhẹ.

### Product card style

- White card.
- Thin black border hoặc soft gray border.
- Badge nhỏ màu cam.
- Heading lớn.
- Tagline 2-3 dòng.
- Placeholder image area.

## 6. How to Build Section UI

Khách chưa chốt layout, nên đề xuất layout riêng.

### Option được chọn: Orbit Steps

Ý tưởng:

Ba bước được trình bày như 3 hành tinh/nút trên một quỹ đạo.

Desktop:

```txt
              Step 2
           Mix & Match

Step 1                         Step 3
Set Your Vibe                  Tell Your Story
```

Hoặc 3 cards ngang có đường nối:

```txt
[1. Set Your Vibe] --- [2. Mix & match] --- [3. Tell your story]
```

### Card details

Mỗi card gồm:

- Number lớn: 01, 02, 03.
- Heading.
- Short description.
- Decorative icon.

### Animation

- Khi section vào viewport:
  - Heading fade up.
  - Cards stagger từ trái qua phải.
  - Orbit line vẽ từ trái qua phải.
- Hover card:
  - Card nổi lên.
  - Glow nhẹ.
  - Sparkle xuất hiện.

## 7. Our Products UI

### Product Grid

Desktop:

```txt
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Charm Astra │ │ Charm Sirius│ │ Charm Polaris│
└─────────────┘ └─────────────┘ └─────────────┘
```

Tablet:

- 2 cột, card thứ 3 xuống hàng.
- Hoặc scroll ngang.

Mobile:

- 1 cột.

### Product card content order

1. Image.
2. Badge.
3. Heading.
4. Tagline.
5. CTA button `Coming soon`.

Không hiển thị giá.

### Animation

- Cards xuất hiện từ trái sang phải.
- Delay mỗi card khoảng 0.1s - 0.2s.
- Hover card:
  - Lift.
  - Image scale.
  - CTA glow.

## 8. About Page UI

Vì About chủ yếu là chữ, cần tránh layout nhàm chán.

### Proposed layout

#### Our Story

- Large headline.
- Text chia thành 2 paragraphs.
- Có decorative quote mark hoặc orbit line.
- Có side visual placeholder: abstract universe / character illustration / star map.

#### Mission + Vision

- 2 cards lớn đặt cạnh nhau trên desktop.
- Mission card có màu accent nhẹ.
- Vision card có border/doodle.

#### Core Values

- 3 cột.
- Mỗi card có chữ cái lớn: Y, O, U.
- Mỗi card có heading và description.
- Hover từng card có màu accent khác nhau.

#### CTA

- Centered.
- Large pill button.
- Glow hover.
- Click sang `/our-universe`.

## 9. Footer UI

Footer nền đen, chữ trắng.

### Desktop layout

```txt
┌────────────────────────────────────────────────────────────┐
│ Logo + slogan | Address + socials | Main contact grid       │
└────────────────────────────────────────────────────────────┘
```

### Social links

- Dùng icon hoặc text button.
- Hover đổi màu.
- Mở link external với `target="_blank"` và `rel="noopener noreferrer"`.

### Main contact

- Desktop: grid 4 cột x 2 hàng.
- Tablet: 2 cột.
- Mobile: 1 cột.

## 10. Accessibility

- Tất cả button/link phải focus được bằng keyboard.
- Link social có aria-label.
- Image có alt text.
- Text contrast đủ rõ.
- Không dùng animation gây chóng mặt.
- Nên tôn trọng `prefers-reduced-motion`.

## 11. Loading States

Phase 1 có thể dùng static data nên không cần loading phức tạp.

Nếu fetch từ API/database:

- Product cards có skeleton loading.
- Nếu API lỗi, fallback sang static data hoặc thông báo nhẹ.

## 12. Error Handling

- Nếu ảnh chưa có, dùng placeholder.
- Nếu logo chưa có, dùng text logo.
- Nếu social link trống, ẩn link đó.
- Nếu product thiếu image, vẫn hiển thị card đúng layout.
