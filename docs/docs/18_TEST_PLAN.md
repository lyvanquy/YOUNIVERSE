# 18. Test Plan

## Goal

Đảm bảo website YOUniverse đúng brief, chạy ổn định và responsive.

## Test Scope

Test các phần:

- Routing.
- Header.
- Footer.
- Home page.
- Our UNIverse page.
- About page.
- Responsive.
- Animation.
- API nếu có.
- Database nếu có.

## 1. Routing Test

| Test case | Steps | Expected |
|---|---|---|
| Home route | Open `/` | Home page hiển thị |
| Our UNIverse route | Open `/our-universe` | Product listing page hiển thị |
| About route | Open `/about` | About page hiển thị |
| Logo click | Click logo | Navigate to `/` |
| CTA About click | Click CTA on About | Navigate to `/our-universe` |

## 2. Header Test

| Test case | Expected |
|---|---|
| Menu items visible desktop | Home, Our UNIverse, About us hiển thị |
| Hover Home | Chữ nổi lên và đổi màu xanh |
| Hover Our UNIverse | Chữ nổi lên và đổi màu vàng |
| Hover About us | Chữ nổi lên và đổi màu đỏ |
| Active route | Trang hiện tại được highlight |
| Mobile menu | Hamburger mở/đóng được |

## 3. Footer Test

| Test case | Expected |
|---|---|
| Logo/slogan | Hiển thị đúng |
| Address | Hiển thị đúng address |
| Social links | TikTok, Instagram, Facebook có link |
| Social open | Mở tab mới |
| Contacts | Có đủ 8 người |
| Mobile footer | Không bị tràn ngang |

## 4. Home Page Test

| Test case | Expected |
|---|---|
| Hero visible | Có banner/placeholder |
| Marquee visible | Text slogan chạy |
| Product lines | Có Astra, Sirius, Polaris |
| Product hover | Card có hiệu ứng hover |
| How to Build | Có đủ 3 bước |
| Mobile layout | Không vỡ layout |

## 5. Our UNIverse Page Test

| Test case | Expected |
|---|---|
| Banner visible | Có banner/placeholder |
| Headline | Hiển thị `OUR PRODUCTS` |
| Product count | Có 3 product cards |
| Astra data | Badge Unique, heading Charm Astra |
| Sirius data | Badge Passion, heading Charm Sirius |
| Polaris data | Badge Inspiring, heading Charm Polaris |
| No price | Không có giá |
| CTA | Mỗi card có `Coming soon` |
| Card animation | Cards hiện trái sang phải |

## 6. About Page Test

| Test case | Expected |
|---|---|
| Story section | Có headline đúng |
| Mission section | Có nội dung mission |
| Vision section | Có nội dung vision |
| Core values | Có Y/O/U |
| Core values desktop | 3 cột |
| CTA | Có text đúng |
| CTA hover | Nút sáng lên |
| CTA click | Sang `/our-universe` |

## 7. Responsive Test

Test các kích thước:

```txt
375x812
430x932
768x1024
1366x768
1440x900
1920x1080
```

Expected:

- Không horizontal scroll.
- Text không tràn.
- Product cards responsive.
- Footer responsive.
- Mobile menu dùng được.

## 8. Accessibility Test

Check:

- Tab keyboard đi qua được links/buttons.
- Focus state rõ.
- Image có alt.
- Social links có aria-label.
- Text contrast đủ.
- Không có button giả bằng div.

## 9. Performance Test

Run Lighthouse.

Target:

- Performance: >= 85.
- Accessibility: >= 90.
- Best Practices: >= 90.
- SEO: >= 90.

Nếu chưa đạt:

- Tối ưu ảnh.
- Giảm animation.
- Kiểm tra font loading.
- Remove package thừa.

## 10. Build Test

Run:

```bash
npm run lint
npm run build
```

Expected:

- Không lỗi build.
- Không lỗi TypeScript.
- Không lỗi lint nghiêm trọng.

## 11. API Test

Nếu có API:

### GET `/api/products`

Expected:

- Status 200.
- Trả 3 product lines.
- Không có price.

### GET `/api/contacts`

Expected:

- Status 200.
- Trả 8 contacts.

### GET `/api/socials`

Expected:

- Status 200.
- Trả TikTok, Instagram, Facebook.

### POST `/api/leads`

Expected:

- Validate input.
- Lưu database nếu hợp lệ.
- Trả 201.

## 12. Database Test

Run:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

Expected:

- Migration thành công.
- Prisma Studio mở được.
- Có bảng:
  - ProductLine
  - SocialLink
  - ContactPerson
  - SiteSetting
  - PageContent
  - LeadSubmission

## 13. Client Review Checklist

Gửi khách kiểm tra:

- Tên thương hiệu đúng chưa?
- Logo đúng chưa?
- Banner đúng chưa?
- Ảnh sản phẩm đúng chưa?
- Social links đúng chưa?
- Contact đúng chưa?
- Text About đúng chưa?
- Có cần thêm bán hàng thật không?
- Có cần song ngữ không?
