# 14. Assets Checklist

## Assets khách hàng cần gửi

Theo brief, nhiều material sẽ được cập nhật sau. Trước khi code hoặc trước khi hoàn thiện UI, cần xin khách các file sau.

## Required Assets

### 1. Logo

Cần:

- Logo bản sáng dùng trên nền trắng.
- Logo bản tối hoặc trắng dùng trên footer nền đen.
- Format ưu tiên:
  - SVG
  - PNG transparent
  - WebP

Suggested paths:

```txt
public/images/logo/logo-light.svg
public/images/logo/logo-dark.svg
```

Nếu chưa có:

- Dùng text logo `YOUniverse`.

### 2. Home Banner

Cần:

- Banner cho trang Home.
- Kích thước đề xuất:
  - Desktop: 1920x900 hoặc 1920x1080.
  - Mobile: bản crop riêng nếu có.
- Format:
  - WebP
  - AVIF
  - PNG/JPG nếu chưa tối ưu.

Suggested path:

```txt
public/images/banners/home-banner.webp
```

Nếu chưa có:

- Dùng placeholder bằng CSS shape/sparkle.

### 3. Our UNIverse Banner

Cần:

- Banner cho trang Our UNIverse.
- Kích thước tương tự Home banner.

Suggested path:

```txt
public/images/banners/our-universe-banner.webp
```

Nếu chưa có:

- Dùng placeholder.

### 4. Product Images

Cần ảnh cho 3 dòng charm:

```txt
Charm Astra
Charm Sirius
Charm Polaris
```

Suggested paths:

```txt
public/images/products/charm-astra.webp
public/images/products/charm-sirius.webp
public/images/products/charm-polaris.webp
```

Nếu chưa có:

- Dùng placeholder card image.

### 5. Font Files

Brief có font:

- YOUTH - Secondary Font.
- Montserrat - Paragraph font.

Cần khách gửi hoặc xác nhận nguồn sử dụng hợp pháp.

Suggested paths:

```txt
public/fonts/youth/
public/fonts/montserrat/
```

Lưu ý:

- YOUTH có thể lỗi tiếng Việt có dấu.
- Không dùng YOUTH cho paragraph tiếng Việt.
- Montserrat có thể dùng từ Google Fonts nếu được phép.

### 6. Social Icons

Không bắt buộc nếu dùng icon library.

Có thể dùng:

- lucide-react icons.
- Simple text links.
- SVG icons khách gửi.

Cần icon:

- TikTok.
- Instagram.
- Facebook.

## Optional Assets

### About Illustration

Vì About page nhiều chữ, nên có thể xin thêm:

- Ảnh team.
- Ảnh moodboard.
- Minh họa vũ trụ.
- Ảnh quá trình làm charm.
- Ảnh sản phẩm lifestyle.

### Decorative Elements

Nếu khách có bộ element riêng:

- Stars.
- Sparkles.
- Doodle.
- Shapes.
- Planet icons.
- Sticker graphics.

Suggested path:

```txt
public/images/elements/
```

## Asset Naming Rules

Dùng lowercase và dấu gạch ngang.

Good:

```txt
charm-astra.webp
home-banner.webp
logo-dark.svg
sparkle-blue.svg
```

Avoid:

```txt
Ảnh sản phẩm 1.png
final-final-logo-new.png
banner Trang chủ.jpg
```

## Placeholder Strategy

Khi chưa có assets thật:

### Logo

```txt
YOUniverse
```

### Banner

Dùng CSS background:

- White/off-white.
- Stars.
- Colorful accent shapes.
- Large text.

### Product

Dùng placeholder card:

- Abstract planet/charm shape.
- Label tạm: Astra/Sirius/Polaris.
- Dùng màu accent khác nhau.

## Questions to Ask Client

Trước khi final website:

1. Logo cuối cùng là `YOUniverse` hay `UNIverse`?
2. Có cần song ngữ không?
3. Banner có text sẵn trong ảnh hay cần code text đè lên?
4. Ảnh sản phẩm cần crop vuông, ngang hay tự do?
5. Có yêu cầu kích thước ảnh cụ thể không?
6. Font có được phép nhúng vào website không?
7. CTA product `Coming soon` có cần click được không?
8. Social links đã chính xác chưa?
