# 12. AI Coding Rules

## General Rules

1. Đọc toàn bộ tài liệu trong thư mục `docs` trước khi code.
2. Không tự ý thêm chức năng ngoài brief.
3. Code theo component nhỏ, không viết tất cả trong một file.
4. Dùng TypeScript cho toàn bộ source code.
5. Dùng Tailwind CSS cho styling.
6. Dùng Framer Motion cho animation cần motion phức tạp.
7. Dùng Next.js App Router.
8. Không dùng Pages Router.
9. Không dùng JavaScript nếu project đã chốt TypeScript.
10. Không hard-code quá nhiều content trong component nếu có thể đưa vào `src/data`.

## Scope Rules

### Must build

- Home page.
- Our UNIverse page.
- About us page.
- Header.
- Footer.
- Product cards.
- Marquee slogan.
- How to Build section.
- About story/mission/vision/core values.
- CTA button.
- Responsive layout.
- Hover animation.

### Must not build unless confirmed

- Cart.
- Checkout.
- Payment.
- User login.
- Admin dashboard.
- Order management.
- Product price.
- Inventory.
- Coupon.
- Email automation.

## Design Rules

1. Base background phải là trắng hoặc rất sáng.
2. Text chính là đen.
3. Accent dùng xanh, vàng, đỏ, cam.
4. Có element star/sparkle/blink blink.
5. Không làm style quá dark.
6. Footer nền đen theo brief.
7. Heading English có thể dùng font YOUTH.
8. Text tiếng Việt nên dùng Montserrat để tránh lỗi dấu.
9. Không dùng quá nhiều animation làm rối mắt.
10. Phải có responsive cho mobile.

## Content Rules

1. Không sửa slogan:
   `A galaxy to hold, a story to be told`
2. Không sửa tên product:
   - Charm Astra
   - Charm Sirius
   - Charm Polaris
3. Không hiển thị giá sản phẩm.
4. CTA product là:
   `Coming soon`
5. About page phải giữ đúng ý nghĩa story/mission/vision/core values.
6. Footer phải có address, social links và main contacts.

## Asset Rules

1. Logo chưa có thì dùng text logo `YOUniverse`.
2. Banner chưa có thì dùng placeholder.
3. Ảnh sản phẩm chưa có thì dùng placeholder.
4. Đặt ảnh vào `public/images`.
5. Dùng `next/image` khi có ảnh thật.
6. Không tải font trái phép.
7. Không chia sẻ hoặc commit font nếu chưa có quyền rõ ràng.

## Code Organization Rules

1. Components đặt trong `src/components`.
2. Data đặt trong `src/data`.
3. Types đặt trong `src/types`.
4. Helpers đặt trong `src/lib`.
5. Routes đặt trong `src/app`.
6. Prisma đặt trong `prisma`.
7. Không tạo component quá dài. Nếu component quá 200 dòng, cân nhắc tách nhỏ.

## Tailwind Rules

1. Ưu tiên utility classes.
2. Dùng CSS variables cho brand colors.
3. Tạo helper `cn` bằng `clsx` + `tailwind-merge`.
4. Không lặp class phức tạp quá nhiều, có thể tạo component.
5. Responsive dùng:
   - `sm:`
   - `md:`
   - `lg:`
   - `xl:`

## Framer Motion Rules

1. Dùng `motion.div` cho section/card cần animation.
2. Tạo variants trong `src/lib/motion.ts`.
3. Dùng stagger cho list cards.
4. Tôn trọng `prefers-reduced-motion` nếu có thể.
5. Không animate layout quá nặng.

## Prisma Rules

1. Dùng Prisma Client singleton trong `src/lib/db.ts`.
2. Không tạo PrismaClient mới ở nhiều nơi.
3. Phone lưu string.
4. Slug phải unique.
5. Product price không có trong Phase 1.
6. Nếu thêm e-commerce sau này thì tạo migration mới, không nhét vào schema phase 1 nếu chưa cần.

## API Rules

1. Route handlers đặt trong `src/app/api`.
2. Validate input bằng zod cho POST.
3. Trả response JSON format nhất quán.
4. Không leak error stack ở production.
5. Public GET API chỉ trả data active.

## Accessibility Rules

1. Button và link phải có focus style.
2. Image phải có alt.
3. Icon-only link phải có aria-label.
4. Text contrast phải đủ rõ.
5. Menu mobile phải dùng button thật.
6. External links dùng `target="_blank"` và `rel="noopener noreferrer"`.

## Performance Rules

1. Tối ưu ảnh bằng `next/image`.
2. Không import thư viện nặng nếu không cần.
3. Dùng static rendering nếu có thể.
4. Không gọi API client-side nếu data có thể render server-side.
5. Lazy-load phần không quan trọng nếu cần.

## Commit / Implementation Order for AI

AI nên code theo thứ tự:

1. Init Next.js + TypeScript + Tailwind.
2. Setup fonts/colors/global styles.
3. Tạo data files.
4. Tạo shared components.
5. Tạo Header/Footer.
6. Tạo Home page.
7. Tạo Our UNIverse page.
8. Tạo About page.
9. Thêm animation.
10. Làm responsive.
11. Setup Prisma schema.
12. Tạo API optional.
13. Test build/lint.
14. Fix lỗi.
