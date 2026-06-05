# AI Master Prompt for Coding YOUniverse Website

Bạn là senior full-stack developer. Hãy code website YOUniverse theo đúng bộ tài liệu trong thư mục `docs`.

## Công nghệ bắt buộc

- Node.js
- PostgreSQL
- Prisma ORM
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion

## Yêu cầu quan trọng

1. Đọc tất cả tài liệu trong `docs`.
2. Không tự ý thêm chức năng ngoài brief.
3. Giai đoạn 1 gồm 3 trang:
   - Home: `/`
   - Our UNIverse: `/our-universe`
   - About us: `/about`
4. Có Header và Footer chung.
5. Header:
   - Logo ở giữa desktop.
   - Menu bên trái.
   - Menu: Home, Our UNIverse, About us.
   - Hover đổi màu xanh/vàng/đỏ và nổi lên.
6. Footer:
   - Nền đen.
   - Logo + slogan.
   - Address.
   - Social links.
   - Main contact 8 người.
7. Home:
   - Banner.
   - Marquee slogan.
   - Product line carousel Astra/Sirius/Polaris.
   - How to Build Your YOUniverse.
8. Our UNIverse:
   - Banner.
   - Headline OUR PRODUCTS.
   - 3 cards: Charm Astra, Charm Sirius, Charm Polaris.
   - Không hiển thị giá.
   - CTA là Coming soon.
9. About:
   - Our Story.
   - Our Mission.
   - Our Vision.
   - Core Values Y/O/U.
   - CTA button sang `/our-universe`.
10. Responsive đầy đủ.
11. Animation dùng Framer Motion, nhẹ và mượt.
12. Dùng placeholder cho logo/banner/product image nếu chưa có asset thật.
13. Không dùng font YOUTH cho tiếng Việt có dấu nếu gây lỗi. Dùng Montserrat cho paragraph và tiếng Việt.

## Thứ tự code

1. Tạo project structure.
2. Cài dependencies.
3. Tạo data files trong `src/data`.
4. Tạo types trong `src/types`.
5. Tạo helpers trong `src/lib`.
6. Tạo shared components.
7. Tạo Header/Footer.
8. Code Home page.
9. Code Our UNIverse page.
10. Code About page.
11. Thêm animation.
12. Thêm responsive.
13. Setup Prisma schema theo `database/schema.prisma`.
14. Tạo API optional nếu cần.
15. Chạy build/lint và sửa lỗi.

## Không được làm

- Không thêm cart/checkout/payment/admin nếu chưa được yêu cầu.
- Không hiển thị giá sản phẩm.
- Không đổi slogan.
- Không đổi tên sản phẩm.
- Không viết tất cả code trong một file.
- Không dùng JavaScript thay TypeScript.
- Không dùng Pages Router.
- Không bỏ qua responsive.

## Output mong muốn

Code hoàn chỉnh, chạy được bằng:

```bash
npm install
npm run dev
```

Và build được bằng:

```bash
npm run build
```
