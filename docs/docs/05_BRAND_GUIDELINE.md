# 05. Brand Guideline

## Brand Name

- Primary: `YOUniverse`
- Secondary/brief spelling: `UNIverse`

## Brand Idea

YOUniverse là một thương hiệu phụ kiện cá nhân hóa, nơi mỗi chiếc charm đại diện cho một phần trong "vũ trụ" riêng của người dùng.

Thông điệp cốt lõi:

```txt
A galaxy to hold, a story to be told
```

## Visual Direction

Phong cách thiết kế cần bám sát moodboard:

- Trẻ trung.
- Gen Z.
- Playful.
- Vũ trụ.
- Cá tính.
- Blink blink.
- Nhiều khoảng trắng.
- Dùng typography lớn, rõ, có tính graphic.
- Có element trang trí như star, sparkle, wave, shape, doodle.

## Main Style

Tổng thể nên có cảm giác:

```txt
White background + black typography + colorful accents + cosmic decorative elements
```

## Color System

### Base Colors

| Token | Màu | Mục đích |
|---|---|---|
| `background` | White | Nền chính |
| `foreground` | Black | Text chính |
| `muted` | Light gray | Section background nhẹ |
| `border` | Soft gray | Border card / divider |

### Brand Accent Colors

Brief ghi điểm thêm hiệu ứng màu xanh, vàng, đỏ.

Đề xuất token:

| Token | Usage |
|---|---|
| `brand-blue` | Hover Home, sparkle, link highlight |
| `brand-yellow` | Hover Our UNIverse, highlight, sticker |
| `brand-red` | Hover About us, accent shape |
| `brand-orange` | Product badge nhỏ |

Có thể dùng giá trị tạm:

```css
--brand-blue: #2563eb;
--brand-yellow: #facc15;
--brand-red: #ef4444;
--brand-orange: #f97316;
--brand-black: #111111;
--brand-white: #ffffff;
```

Developer note:

- Giá trị màu có thể đổi sau nếu khách cung cấp brand color chính xác.
- Không nên dùng quá nhiều màu trong một section; chỉ dùng làm điểm nhấn.

## Typography

### Heading Font

Font: `YOUTH`

Mục đích:

- Dùng cho heading lớn.
- Dùng cho tiêu đề tiếng Anh.
- Dùng cho brand display text.

Lưu ý quan trọng:

- Brief ghi font YOUTH có thể lỗi khi kết hợp chữ có dấu.
- Tránh dùng YOUTH cho tiếng Việt có dấu.
- Với heading tiếng Việt, dùng Montserrat hoặc font fallback.

### Paragraph Font

Font: `Montserrat`

Mục đích:

- Paragraph.
- Menu.
- Button.
- Label.
- Card content.
- Footer.
- Text nhỏ.

## Font Loading

Đề xuất:

```txt
public/fonts/youth/
public/fonts/montserrat/
```

Trong lúc chưa có font:

- Dùng `Montserrat` từ Google Fonts nếu được.
- Heading dùng fallback `Arial Black`, `Impact`, hoặc `sans-serif`.

Không commit font nếu chưa có quyền sử dụng rõ ràng.

## Logo

Hiện tại khách chưa cung cấp logo.

Temporary logo:

```txt
YOUniverse
```

Yêu cầu khi có logo:

- Logo dùng ở Header.
- Logo dùng ở Footer.
- Logo click về Home.
- Cần có bản nền sáng và nền tối nếu footer là nền đen.

## Image Direction

Hình ảnh nên có:

- Background sáng.
- Product focus.
- Dạng editorial / playful / graphic.
- Có thể thêm doodle, sparkle, planet, star.
- Không quá dark trừ khi dùng section contrast.

## Decorative Elements

Các element nên có:

- Stars.
- Sparkles.
- Blink shapes.
- Doodle line.
- Planet/orbit.
- Abstract colorful stickers.
- Small geometric shapes.

## Motion Direction

Animation cần:

- Nhẹ.
- Vui.
- Không quá rối.
- Không làm chậm trang.

Nên dùng:

- Fade in.
- Slide up.
- Slide left/right.
- Scale on hover.
- Glow on CTA.
- Marquee loop.
- Sparkle floating.
- Product cards stagger animation.

Không nên:

- Animation quá nhanh.
- Quá nhiều object chuyển động cùng lúc.
- Parallax nặng.
- Motion gây khó đọc.

## UI Personality

Giao diện nên tạo cảm giác giống:

- Một brand deck sống động.
- Một landing page cá tính.
- Một catalog sản phẩm chưa mở bán.
- Một không gian kể chuyện về bản sắc cá nhân.

## Do

- Giữ nhiều khoảng trắng.
- Dùng black typography mạnh.
- Dùng màu accent đúng lúc.
- Có hover effect rõ.
- Tách component rõ.
- Dễ thay ảnh sản phẩm.

## Don't

- Không làm giao diện quá corporate.
- Không dùng quá nhiều gradient tối.
- Không để text Việt bằng font YOUTH nếu bị lỗi dấu.
- Không thêm giá sản phẩm vì brief yêu cầu bỏ giá.
- Không thêm nút mua hàng nếu khách chưa xác nhận.
