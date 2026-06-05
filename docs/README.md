# YOUniverse / UNIverse Website - AI Coding Documentation Pack

Bộ tài liệu này dùng để đưa cho AI code hoặc developer để triển khai website theo brief `WEBSITE.pdf`.

## Công nghệ đã chốt

- Node.js
- PostgreSQL
- Prisma ORM
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

## Phạm vi theo brief hiện tại

Giai đoạn 1 gồm 3 landing page:

1. Home
2. Our UNIverse
3. About us

Theo brief hiện tại, website tập trung vào giới thiệu thương hiệu, giới thiệu 3 dòng charm và điều hướng người dùng. Chưa có yêu cầu rõ ràng về giỏ hàng, đặt hàng, thanh toán, đăng nhập hoặc admin quản trị sản phẩm. Vì vậy, bộ tài liệu này chia làm 2 phần:

- Phần bắt buộc cho Giai đoạn 1: giao diện 3 landing page, animation, responsive, nội dung, header, footer.
- Phần backend nền tảng: PostgreSQL + Prisma để lưu product lines, contacts, social links, page content và lead/contact submission nếu cần mở rộng.

Nếu khách hàng xác nhận cần bán hàng thật, hãy bổ sung thêm các module: cart, checkout, payment, order management, admin dashboard.

## Cách dùng với AI code

1. Đưa toàn bộ thư mục này vào project.
2. Yêu cầu AI đọc theo thứ tự:
   - `docs/01_PROJECT_OVERVIEW.md`
   - `docs/02_REQUIREMENTS.md`
   - `docs/03_PAGE_STRUCTURE.md`
   - `docs/04_CONTENT.md`
   - `docs/05_BRAND_GUIDELINE.md`
   - `docs/06_UI_UX_SPEC.md`
   - `docs/07_COMPONENTS.md`
   - `docs/08_TECH_STACK.md`
   - `docs/09_PROJECT_STRUCTURE.md`
   - `docs/10_DATABASE_AND_PRISMA.md`
   - `docs/11_API_SPEC.md`
   - `docs/12_AI_CODING_RULES.md`
   - `docs/13_ACCEPTANCE_CRITERIA.md`
3. Copy nội dung `prompts/AI_MASTER_PROMPT.md` vào AI coding tool.
4. Dùng `database/schema.prisma` làm schema khởi đầu nếu cần database ngay.
5. Dùng `.env.example` để tạo file `.env`.

## Lưu ý quan trọng

- Logo, banner và ảnh sản phẩm hiện chưa có, cần dùng placeholder trước.
- Font YOUTH không nên dùng cho tiếng Việt có dấu vì brief ghi có thể lỗi font.
- Montserrat dùng cho paragraph, menu, button và text nhỏ.
- Không tự ý thêm chức năng ngoài phạm vi nếu khách chưa xác nhận.
